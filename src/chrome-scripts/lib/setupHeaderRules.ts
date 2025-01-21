export async function setupHeaderRules(domain: string = "localhost") {
  const rules: chrome.declarativeNetRequest.Rule[] = [
    {
      id: 1,
      condition: {
        requestDomains: [domain],
      },
      action: {
        type: chrome.declarativeNetRequest.RuleActionType.MODIFY_HEADERS,
        requestHeaders: [
          {
            header: "origin",
            operation: chrome.declarativeNetRequest.HeaderOperation.SET,
            value: `http://${domain}`,
          },
        ],
      },
    },
  ];

  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: rules.map((r) => r.id),
    addRules: rules,
  });
}
