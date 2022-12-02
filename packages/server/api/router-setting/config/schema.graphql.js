module.exports = {
  definition: ` 
    input RouterSettingBatchInput {
      name: String
      path: String
      authority: String
      disabled: Boolean
      invisible: Boolean
      sort: Int
      level: Int
      fullPath: String
      displayName: String
      parent: ID
      children: [RouterSettingBatchInput]
      published_at: DateTime
      created_by: ID
      updated_by: ID
    }
  `,
  query: ` `,
  mutation: `
  batchCreateRouterSetting(input: [RouterSettingBatchInput] ): JSON
  `,
  resolver: {
    Mutation: {
      batchCreateRouterSetting: {
        resolver:
          'application::router-setting.router-setting.batchCreateRouterSetting',
      },
    },
  },
};
