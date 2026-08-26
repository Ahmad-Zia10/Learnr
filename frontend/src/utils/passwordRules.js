//Rules mirrored in the "Choose new password" design, which shows a live checklist.
export const PASSWORD_RULES = [
    { id: "lower",   label: "one lower case character", test: (v) => /[a-z]/.test(v) },
    { id: "upper",   label: "one upper case character", test: (v) => /[A-Z]/.test(v) },
    { id: "number",  label: "one number",               test: (v) => /[0-9]/.test(v) },
    { id: "special", label: "one special character",    test: (v) => /[^A-Za-z0-9]/.test(v) },
    { id: "length",  label: "8 character minimum",      test: (v) => v.length >= 8 },
];

//Which rules a candidate password currently satisfies.
export const evaluatePassword = (password = "") =>
    PASSWORD_RULES.map((rule) => ({ ...rule, passed: rule.test(password) }));

export const isPasswordValid = (password = "") =>
    PASSWORD_RULES.every((rule) => rule.test(password));
