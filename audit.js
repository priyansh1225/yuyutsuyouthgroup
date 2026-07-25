// audit.js
// Hash-chained audit logging - each entry's hash depends on the previous entry's hash,
// so altering any past entry breaks every hash after it (same principle as a blockchain).

async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

async function logAction(actionType, tableAffected, dataChanged) {
  try {
    const { data: { session } } = await supabaseClient.auth.getSession();
    const userEmail = session?.user?.email || "unknown";

    // Get the most recent log entry's hash - this becomes our "previous_hash"
    const { data: lastLogs } = await supabaseClient
      .from("audit_log")
      .select("hash")
      .order("created_at", { ascending: false })
      .limit(1);

    const previousHash = (lastLogs && lastLogs.length > 0) ? lastLogs[0].hash : "GENESIS";

    const timestamp = new Date().toISOString();
    const dataChangedStr = typeof dataChanged === "string" ? dataChanged : JSON.stringify(dataChanged);

    // The string we hash includes the previous hash - THIS is the "chain link"
    const rawString = `${timestamp}|${userEmail}|${actionType}|${tableAffected}|${dataChangedStr}|${previousHash}`;
    const newHash = await sha256(rawString);

    await supabaseClient.from("audit_log").insert([{
      timestamp,
      user: userEmail,
      action_type: actionType,
      table_affected: tableAffected,
      data_changed: dataChangedStr,
      hash: newHash,
      previous_hash: previousHash
    }]);
  } catch (err) {
    console.error("Audit logging failed:", err);
  }
}