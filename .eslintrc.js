module.exports = {
	"plugins": [
		'jasmine'
	],
    "env": {
        "browser": true,
        "es6": true,
				"jasmine": true,
    },
    "extends": ["eslint:recommended", "plugin:jasmine/recommended"],
    "rules": {
        "indent": [
            "error",
            "tab"
        ],
        "linebreak-style": [
            "error",
            "windows"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ]
    }
};
