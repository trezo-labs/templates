export const contractAddress =
  "0x75410d36a0690670137c3d15c01fcfa2ce094a4d0791dc769ef18c1c423a7f8";

export const contractAbi = [
  {
    type: "impl",
    name: "TestSession",
    interface_name: "counter_starknetjs::ITestSession",
  },
  {
    type: "interface",
    name: "counter_starknetjs::ITestSession",
    items: [
      {
        type: "function",
        name: "increase_counter",
        inputs: [
          {
            name: "value",
            type: "core::integer::u128",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "decrease_counter",
        inputs: [
          {
            name: "value",
            type: "core::integer::u128",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "get_counter",
        inputs: [],
        outputs: [
          {
            type: "core::integer::u128",
          },
        ],
        state_mutability: "view",
      },
    ],
  },
  {
    type: "event",
    name: "counter_starknetjs::test_session::Event",
    kind: "enum",
    variants: [],
  },
] as const;
