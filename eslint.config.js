
module.exports = [{
    languageOptions: {
        ecmaVersion: 2022,
        "globals": {
            "Grav": true,
            "project": true,
            "Parvus": true
        },
    },
    'ignores': [ '**/vendor/*'],
    "rules": {
        "indent": [
            "error",
            4
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ],
        "no-unused-vars": [
            1,
            { "vars": "all", "args": "after-used" }
        ]
    }
}];
