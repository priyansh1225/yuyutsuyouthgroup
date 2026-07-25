// logs.js
let logsData = [];

async function checkAuthAndLoad() {
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (!session) {
    document.getElementById("logsBody").innerHTML = `<tr><td colspan="6">You must be logged in via the Admin panel to view logs. <a href="admin.html">Go to Admin</a></td></tr>`;
    document.getElementById("verifyBtn").disabled = true;
    return;
  }
  loadLogs();
}

async function loadLogs() {
  const { data, error } = await supabaseClient
    .from("audit_log")
    .select("*")
    .order("created_at", { ascending: true }); // oldest first - needed for correct chain order

  if (error) {
    document.getElementById("logsBody").innerHTML = `<tr><td colspan="6">Error loading logs.</td></tr>`;
    return;
  }

  logsData = data;
  renderLogs();
}

function renderLogs() {
  const body = document.getElementById("logsBody");
  body.innerHTML = "";

  logsData.forEach((log) => {
    const row = document.createElement("tr");
    row.id = `log-row-${log.id}`;
    row.innerHTML = `
      <td>${new Date(log.created_at).toLocaleString()}</td>
      <td>${log.user}</td>
      <td>${log.action_type}</td>
      <td>${log.data_changed}</td>
      <td class="hash-cell">${log.hash.substring(0, 12)}...</td>
      <td class="log-status">—</td>
    `;
    body.appendChild(row);
  });
}

// Recomputes each log's hash and compares it to what's stored,
// and checks each entry's previous_hash against the prior entry's actual hash
async function verifyChain() {
  const resultBox = document.getElementById("verifyResult");

  if (!logsData || logsData.length === 0) {
    resultBox.innerHTML = `<span class="status-fail">⚠️ No logs loaded — cannot verify.</span>`;
    return;
  }

  resultBox.textContent = "Verifying...";

  let brokenAt = -1;

  for (let i = 0; i < logsData.length; i++) {
    const log = logsData[i];
    const expectedPreviousHash = i === 0 ? "GENESIS" : logsData[i - 1].hash;
    const statusCell = document.querySelector(`#log-row-${log.id} .log-status`);

    // Check 1: does this entry point to the correct previous entry?
    const linkOk = log.previous_hash === expectedPreviousHash;

    // Check 2: recompute the hash from stored data - does it match?
    const rawString = `${log.timestamp}|${log.user}|${log.action_type}|${log.table_affected}|${log.data_changed}|${log.previous_hash}`;
    const recomputedHash = await sha256(rawString);
    const hashOk = recomputedHash === log.hash;

    if (linkOk && hashOk) {
      statusCell.innerHTML = `<span class="status-ok">✅ Verified</span>`;
    } else {
      statusCell.innerHTML = `<span class="status-fail">❌ Tampered</span>`;
      if (brokenAt === -1) brokenAt = i;
    }
  }

  if (brokenAt === -1) {
    resultBox.innerHTML = `<span class="status-ok">✅ Chain fully verified — no tampering detected.</span>`;
  } else {
    resultBox.innerHTML = `<span class="status-fail">❌ Tampering detected starting at entry #${brokenAt + 1} (and everything after it is now invalid, since the chain is broken from that point).</span>`;
  }
}

document.getElementById("verifyBtn").addEventListener("click", verifyChain);

checkAuthAndLoad();