
module.exports = [{
    /*
    "env": {
        "browser": true,
        "node": true
    },
    "parserOptions": {
        "ecmaVersion": 2024
    },
    "extends": "eslint:recommended",
    "globals": {
        "Grav": true,
        "project": true,
        "Chocolat": true
    },
    */
    languageOptions: {
        ecmaVersion: 2022,
        "globals": {
            "Grav": true,
            "project": true,
            "Chocolat": true
        },
    },
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
