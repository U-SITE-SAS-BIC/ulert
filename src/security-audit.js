function securityAudit(url, headers) {
  const checks = {
    'Strict-Transport-Security': !!headers['strict-transport-security'],
    'X-Frame-Options': !!headers['x-frame-options'],
    'X-Content-Type-Options': headers['x-content-type-options'] === 'nosniff',
    'Content-Security-Policy': !!headers['content-security-policy'],
    'Permissions-Policy': !!headers['permissions-policy'],
  };

  const passed = Object.values(checks).filter(Boolean).length;
  const total = Object.keys(checks).length;

  return {
    checks,
    score: `${passed}/${total}`,
    ok: passed >= 3,
  };
}

module.exports = securityAudit;