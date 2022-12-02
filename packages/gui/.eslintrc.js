module.exports = {
  root: true,
  env: {
    node: true
  },

  extends: [
    'plugin:vue/vue3-recommended',
		"prettier"
  ],

  parserOptions: {
    "parser": "@babel/eslint-parser",
    ecmaVersion: 2020
  },

  rules: {
    'no-var': 'error', 
    'no-console': 'off', 
    'no-debugger': 'off', 
		"no-unused-vars": ['error', {"vars": "all", "args": "after-used"}],
    'vue/attribute-hyphenation': 'warn',
    'vue/attributes-order': 'off',
    'vue/block-lang': ['error',
      {
        script: {
          lang: ['ts', 'js']
        },
        style: {
          lang: ['less', 'sass', 'css']
        }
      }
    ],
    'vue/block-tag-newline': ['error',
      {
        // consistent 
        // always 
        // never 
        singleline: 'consistent',
        // consistent 
				// always 
        // never 
        multiline: 'consistent',
        maxEmptyLines: 0,
        blocks: {
          template: {
            //  | "never" | "consistent" | "ignore",
            singleline: 'consistent',
            multiline: 'consistent',
            maxEmptyLines: 2
          },
          script: {
            singleline: 'consistent',
            multiline: 'consistent',
            maxEmptyLines: 2
          }
        }
      }
    ],
    /// eslint-disable 
    /// eslint-enable 
    'vue/comment-directive': ['error',
      {
        reportUnusedDisableDirectives: true
      }
    ],
    'vue/component-api-style': ['off',
      [
        'script-setup',
        'composition'
      ] // "script-setup", "composition", "composition-vue2", or "options"
    ],
    'vue/component-definition-name-casing': 'error',
    'vue/component-name-in-template-casing': 'warn',
    'vue/component-tags-order': 'warn',
    'vue/custom-event-name-casing': 'off',
    'vue/experimental-script-setup-vars': 'error',
    'vue/html-button-has-type': 'warn',
    'vue/html-closing-bracket-newline': 'warn',
    'vue/html-closing-bracket-spacing': 'warn',
    'vue/html-comment-content-newline': 'warn',
    'vue/html-comment-content-spacing': 'warn',
    'vue/html-comment-indent': 'warn',
    'vue/html-end-tags': 'warn',
    'vue/html-indent': 'warn',
    'vue/html-quotes': 'warn',
    'vue/html-self-closing': 'warn',
    'vue/jsx-uses-vars': 'error',
    'vue/match-component-file-name': 'warn',
    'vue/max-attributes-per-line': 'warn',
    'vue/max-len': ['error',
      {
        code: 120, // default 80
        template: 140, // default code
        tabWidth: 2, // default 2
        comments: 140, // default code
        ignorePattern: '', 
        ignoreComments: false, 
        ignoreTrailingComments: false, 
        ignoreUrls: true, 
        ignoreStrings: true, 
        ignoreTemplateLiterals: true, 
        ignoreRegExpLiterals: true, 
        ignoreHTMLAttributeValues: false, 
        ignoreHTMLTextContents: true 
      }
    ],
    'vue/multi-word-component-names': 'off',
    'vue/multiline-html-element-content-newline': 'warn',
    'vue/mustache-interpolation-spacing': 'warn',
    'vue/name-property-casing': 'warn',
    'vue/new-line-between-multi-line-property': 'warn',
    'vue/next-tick-style': 'warn',
    'vue/no-arrow-functions-in-watch': 'error',
    'vue/no-async-in-computed-properties': 'error',
    'vue/no-bare-strings-in-template': ['off',
      {
        allowlist: [
          '(', ')', ',', '.', '&', '+', '-', '=', '*', '/', '#', '%', '!', '?', ':', '[', ']', '{', '}', '<', '>', '\u00b7', '\u2022', '\u2010', '\u2013', '\u2014', '\u2212', '|'
        ],
        attributes: {
          '/.+/': ['title', 'aria-label', 'aria-placeholder', 'aria-roledescription', 'aria-valuetext'],
          input: ['placeholder'],
          img: ['alt']
        },
        directives: ['v-text']
      }
    ],
    'vue/no-boolean-default': 'error',
    'vue/no-computed-properties-in-data': 'error',
    'vue/no-confusing-v-for-v-if': 'error',
    'vue/no-custom-modifiers-on-v-model': 'warn',
    'vue/no-deprecated-data-object-declaration': 'error',
    'vue/no-deprecated-destroyed-lifecycle': 'error',
    'vue/no-deprecated-dollar-listeners-api': 'error',
    'vue/no-deprecated-dollar-scopedslots-api': 'error',
    'vue/no-deprecated-events-api': 'error',
    'vue/no-deprecated-filter': 'error',
    'vue/no-deprecated-functional-template': 'error',
    'vue/no-deprecated-html-element-is': 'error',
    'vue/no-deprecated-inline-template': 'error',
    'vue/no-deprecated-props-default-this': 'error',
    'vue/no-deprecated-router-link-tag-prop': 'error',
    'vue/no-deprecated-scope-attribute': 'error',
    'vue/no-deprecated-slot-attribute': 'error',
    'vue/no-deprecated-slot-scope-attribute': 'error',
    'vue/no-deprecated-v-bind-sync': 'error',
    'vue/no-deprecated-v-is': 'error',
    'vue/no-deprecated-v-on-native-modifier': 'error',
    'vue/no-deprecated-v-on-number-modifiers': 'error',
    'vue/no-deprecated-vue-config-keycodes': 'error',
    'vue/no-dupe-keys': 'error',
    'vue/no-dupe-v-else-if': 'error',
    'vue/no-duplicate-attr-inheritance': 'error',
    'vue/no-duplicate-attributes': 'error',
    'vue/no-empty-component-block': 'off',
    'vue/no-export-in-script-setup': 'error',
    'vue/no-invalid-model-keys': 'error',
    'vue/no-irregular-whitespace': 'error',
    'vue/no-lifecycle-after-await': 'error',
    'vue/no-lone-template': 'error',
    'vue/no-multi-spaces': 'error',
    'vue/no-multiple-objects-in-class': 'error',
    'vue/no-multiple-slot-args': 'error',
    'vue/no-multiple-template-root': 'off',
    'vue/no-mutating-props': 'off',
    'vue/no-parsing-error': 'error',
    'vue/no-potential-component-option-typo': 'error',
    'vue/no-ref-as-operand': 'error',
    'vue/no-reserved-component-names': 'off',
    'vue/no-reserved-keys': 'error',
    'vue/no-restricted-block': 'error',
    'vue/no-restricted-call-after-await': 'error',
    'vue/no-restricted-class': 'error',
    'vue/no-restricted-component-options': 'error',
    'vue/no-restricted-custom-event': 'error',
    'vue/no-restricted-props': 'error',
    'vue/no-restricted-static-attribute': 'error',
    'vue/no-restricted-v-bind': 'error',
    'vue/no-setup-props-destructure': 'error',
    'vue/no-shared-component-data': 'error',
    'vue/no-side-effects-in-computed-properties': 'off',
    'vue/no-spaces-around-equal-signs-in-attribute': 'error',
    'vue/no-static-inline-styles': 'off',
    'vue/no-template-key': 'error',
    'vue/no-template-shadow': 'error',
    'vue/no-template-target-blank': ['off',
      {
        allowReferrer: true, 
        enforceDynamicLinks: 'always'
      }
    ],
    'vue/no-textarea-mustache': 'error',
    'vue/no-this-in-before-route-enter': 'error',
    'vue/no-undef-components': 'off',
    'vue/no-undef-properties': 'off',
    'vue/no-unregistered-components': ['error',
      {
        ignorePatterns: ['a(-\\w+)+', 'font', 'iconfont', 'router-link', 'router-view'] 
      }
    ],
    'vue/no-unsupported-features': 'error',
    'vue/no-unused-components': 'error',
    'vue/no-unused-properties': 'error',
    'vue/no-unused-refs': 'off',
    'vue/no-use-computed-property-like-method': 'error',
    'vue/no-use-v-if-with-v-for': 'error',
    'vue/no-useless-mustaches': 'error',
    'vue/no-useless-template-attributes': 'off',
    'vue/no-useless-v-bind': 'error',
    'vue/no-v-for-template-key-on-child': 'error',
    'vue/no-v-for-template-key': 'error',
    'vue/no-v-html': 'off',
    'vue/no-v-model-argument': 'off',
    'vue/no-v-text': 'error',
    'vue/no-watch-after-await': 'error',
    'vue/one-component-per-file': 'error',
    'vue/order-in-components': 'error',
    'vue/padding-line-between-blocks': 'error',
    'vue/prop-name-casing': 'error',
    'vue/require-component-is': 'error',
    'vue/require-default-prop': 'error',
    'vue/require-direct-export': ['off', {
      disallowFunctionalComponentFunction: false
    }],
    'vue/require-emit-validator': 'off',
    'vue/require-explicit-emits': 'off',
    'vue/require-expose': 'off',
    'vue/require-name-property': 'error',
    'vue/require-prop-type-constructor': 'error',
    'vue/require-prop-types': 'off',
    'vue/require-render-return': 'error',
    'vue/require-slots-as-functions': 'error',
    'vue/require-toggle-inside-transition': 'error',
    'vue/require-v-for-key': 'error',
    'vue/require-valid-default-prop': 'error',
    'vue/return-in-computed-property': 'off',
    'vue/return-in-emits-validator': 'error',
    'vue/script-indent': 'error',
    'vue/script-setup-uses-vars': 'error',
    'vue/singleline-html-element-content-newline': 'error',
    'vue/sort-keys': 'off',
    'vue/static-class-names-order': 'error',
    'vue/this-in-template': 'error',
    'vue/use-v-on-exact': 'error',
    'vue/v-bind-style': 'warn',
    'vue/v-for-delimiter-style': 'warn',
    'vue/v-on-event-hyphenation': 'off',
    'vue/v-on-function-call': 'error',
    'vue/v-on-style': 'error',
    'vue/v-slot-style': 'error',
    'vue/valid-define-emits': 'error',
    'vue/valid-define-props': 'error',
    'vue/valid-next-tick': 'error',
    'vue/valid-template-root': 'error',
    'vue/valid-v-bind-sync': 'error',
    'vue/valid-v-bind': 'error',
    'vue/valid-v-cloak': 'error',
    'vue/valid-v-else-if': 'warn',
    'vue/valid-v-else': 'warn',
    'vue/valid-v-for': 'error',
    'vue/valid-v-html': 'error',
    'vue/valid-v-if': 'error',
    'vue/valid-v-is': 'error',
    'vue/valid-v-memo': 'error',
    'vue/valid-v-model': 'error',
    'vue/valid-v-on': 'error',
    'vue/valid-v-once': 'error',
    'vue/valid-v-pre': 'warn',
    'vue/valid-v-show': 'warn',
    'vue/valid-v-slot': 'warn',
    'vue/valid-v-text': 'warn'
  }
}

