export type Stablesfun = {
  "version": "0.1.0",
  "name": "stablesfun",
  "instructions": [
    {
      "name": "initCoinInstruction",
      "accounts": [
        {
          "name": "metadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "mint"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "payer"
              },
              {
                "kind": "arg",
                "type": {
                  "defined": "InitCoinParams"
                },
                "path": "params.symbol"
              }
            ]
          }
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenMetadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "solVault",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "sol_vault"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Mint",
                "path": "mint"
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "metadata",
          "type": {
            "defined": "InitCoinParams"
          }
        },
        {
          "name": "currency",
          "type": "string"
        },
        {
          "name": "image",
          "type": "string"
        },
        {
          "name": "description",
          "type": "string"
        }
      ]
    },
    {
      "name": "mintCoinsInstruction",
      "accounts": [
        {
          "name": "mint",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "mint"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "payer"
              },
              {
                "kind": "arg",
                "type": "string",
                "path": "symbol"
              }
            ]
          }
        },
        {
          "name": "destination",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "feed",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "solVault",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "sol_vault"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Mint",
                "path": "mint"
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "solAmount",
          "type": "u64"
        },
        {
          "name": "symbol",
          "type": "string"
        }
      ]
    },
    {
      "name": "burnCoinsInstruction",
      "accounts": [
        {
          "name": "mint",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "mint"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "payer"
              },
              {
                "kind": "arg",
                "type": "string",
                "path": "symbol"
              }
            ]
          }
        },
        {
          "name": "source",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "feed",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "solVault",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "sol_vault"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Mint",
                "path": "mint"
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "quantity",
          "type": "u64"
        },
        {
          "name": "symbol",
          "type": "string"
        }
      ]
    },
    {
      "name": "getPrice",
      "accounts": [
        {
          "name": "feed",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "vaultAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "balance",
            "type": "u64"
          },
          {
            "name": "mint",
            "type": "publicKey"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "symbol",
            "type": "string"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "currency",
            "type": "string"
          },
          {
            "name": "uri",
            "type": "string"
          },
          {
            "name": "image",
            "type": "string"
          },
          {
            "name": "description",
            "type": "string"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "InitCoinParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "symbol",
            "type": "string"
          },
          {
            "name": "uri",
            "type": "string"
          },
          {
            "name": "decimals",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidQuantity",
      "msg": "Quantity must be greater than zero."
    },
    {
      "code": 6001,
      "name": "InvalidCalculation",
      "msg": "Token calculation resulted in zero tokens."
    },
    {
      "code": 6002,
      "name": "InsufficientFunds",
      "msg": "Insufficient funds in the PDA."
    },
    {
      "code": 6003,
      "name": "InvalidSymbol",
      "msg": "Invalid symbol."
    },
    {
      "code": 6004,
      "name": "SymbolTooLong",
      "msg": "Symbol must be 4 characters or less."
    },
    {
      "code": 6005,
      "name": "SymbolNotAlphanumeric",
      "msg": "Symbol must be alphanumeric."
    }
  ]
};

export const IDL: Stablesfun = {
  "version": "0.1.0",
  "name": "stablesfun",
  "instructions": [
    {
      "name": "initCoinInstruction",
      "accounts": [
        {
          "name": "metadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "mint"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "payer"
              },
              {
                "kind": "arg",
                "type": {
                  "defined": "InitCoinParams"
                },
                "path": "params.symbol"
              }
            ]
          }
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenMetadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "solVault",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "sol_vault"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Mint",
                "path": "mint"
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "metadata",
          "type": {
            "defined": "InitCoinParams"
          }
        },
        {
          "name": "currency",
          "type": "string"
        },
        {
          "name": "image",
          "type": "string"
        },
        {
          "name": "description",
          "type": "string"
        }
      ]
    },
    {
      "name": "mintCoinsInstruction",
      "accounts": [
        {
          "name": "mint",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "mint"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "payer"
              },
              {
                "kind": "arg",
                "type": "string",
                "path": "symbol"
              }
            ]
          }
        },
        {
          "name": "destination",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "feed",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "solVault",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "sol_vault"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Mint",
                "path": "mint"
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "solAmount",
          "type": "u64"
        },
        {
          "name": "symbol",
          "type": "string"
        }
      ]
    },
    {
      "name": "burnCoinsInstruction",
      "accounts": [
        {
          "name": "mint",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "mint"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "payer"
              },
              {
                "kind": "arg",
                "type": "string",
                "path": "symbol"
              }
            ]
          }
        },
        {
          "name": "source",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "feed",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "solVault",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "sol_vault"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Mint",
                "path": "mint"
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "quantity",
          "type": "u64"
        },
        {
          "name": "symbol",
          "type": "string"
        }
      ]
    },
    {
      "name": "getPrice",
      "accounts": [
        {
          "name": "feed",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "vaultAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "balance",
            "type": "u64"
          },
          {
            "name": "mint",
            "type": "publicKey"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "symbol",
            "type": "string"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "currency",
            "type": "string"
          },
          {
            "name": "uri",
            "type": "string"
          },
          {
            "name": "image",
            "type": "string"
          },
          {
            "name": "description",
            "type": "string"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "InitCoinParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "symbol",
            "type": "string"
          },
          {
            "name": "uri",
            "type": "string"
          },
          {
            "name": "decimals",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidQuantity",
      "msg": "Quantity must be greater than zero."
    },
    {
      "code": 6001,
      "name": "InvalidCalculation",
      "msg": "Token calculation resulted in zero tokens."
    },
    {
      "code": 6002,
      "name": "InsufficientFunds",
      "msg": "Insufficient funds in the PDA."
    },
    {
      "code": 6003,
      "name": "InvalidSymbol",
      "msg": "Invalid symbol."
    },
    {
      "code": 6004,
      "name": "SymbolTooLong",
      "msg": "Symbol must be 4 characters or less."
    },
    {
      "code": 6005,
      "name": "SymbolNotAlphanumeric",
      "msg": "Symbol must be alphanumeric."
    }
  ]
};
