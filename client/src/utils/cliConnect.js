const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

/** PowerShell-friendly connect commands copied from the website. */
export function buildCliConnectCommands(token) {
  return [
    '# Install once from the AgentHire repo:',
    '# cd path/to/agenthire-demo-v2/cli',
    '# npm install && npm install -g .',
    '',
    '# Then from your project folder:',
    `$env:AGENTHIRE_API_URL="${API_URL}"`,
    `agenthire connect --token ${token}`,
  ].join('\n')
}

export function buildCliConnectOneLiner(token) {
  return `$env:AGENTHIRE_API_URL="${API_URL}"; agenthire connect --token ${token}`
}
