module.exports = {
  definition: `
        type KubernetesNamespaces {
            data          : [String]!
            total         : Int
        }
    `,
  query: `
        getK8sNamespaces(id: String!): KubernetesNamespaces!
    `,
  type: {
    KubernetesNamespaces: {
      _description: 'The KubernetesNamespaces type description', // Set the description for the type itself.
      data: 'The k8s namespace list',
      total: 'The namespace count',
    },
  },
  resolver: {
    Query: {
      getK8sNamespaces: {
        description: 'Return k8s namespace',
        resolver: 'application::kubernetes.kubernetes.namespaces',
      },
    },
  },
};
