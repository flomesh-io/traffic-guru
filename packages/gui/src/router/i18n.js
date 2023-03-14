module.exports = {
  messages: {
    CN: {
      Zone: "分区",
      Registry: "注册中心",
      Menu: "菜单",
      "Edit Menu": "编辑菜单",
      name: "Flomesh",
      home: { name: "工作台" },
      login: { name: "登陆" },
      workplace: { name: "工作台" },
      flb: {
        name: "FLB ∣ 软负载",
        dashboard: { name: "看板" },
        "4lb": {
          list: { name: "4LB" },
          detail: { name: "4LB 详情" },
          create: { name: "新建 4LB" },
        },
        "7lb": {
          list: { name: "7LB" },
          detail: { name: "7LB 详情" },
          create: { name: "新建 7LB" },
        },
        address: {
          list: { name: "地址池" },
          detail: { name: "地址池详情" },
          create: { name: "新建地址池" },
        },
        cluster: {
          list: { name: "LB集群" },
          detail: { name: "集群详情" },
        },
        zone: {
          list: { name: "LB分区" },
          detail: { name: "分区详情" },
        },
        node: {
          detail: { name: "节点详情" },
        },
        profile: {
          list: { name: "配置文件" },
          detail: { name: "配置文件详情" },
          create: { name: "新建配置" },
        },
        lbevent: {
          list: { name: "LB操作记录" },
        },
      },
      fsm: {
        name: "FSM ∣ 服务网格",
        dashboard: { name: "看板" },
        sidecar: {
          list: { name: "边车" },
          detail: { name: "边车详情" },
          create: { name: "新建边车" },
        },
        topology: { name: "拓扑" },
        waterfall: {
          list: { name: "时序" },
          detail: { name: "时序详情" },
        },
        service: {
          list: { name: "服务" },
          detail: { name: "服务详情" },
          create: { name: "新建服务" },
          imports: { name: "服务导入" },
        },
        ingress: {
          list: { name: "进栈" },
          detail: { name: "进栈详情" },
          create: { name: "新建进栈" },
        },
        egress: {
          list: { name: "出栈" },
          detail: { name: "出栈详情" },
          create: { name: "新建出栈" },
        },
        vCluster: {
          list: { name: "虚拟服务集群" },
          detail: { name: "虚拟服务集群详情" },
        },
        mesh: {
          list: { name: "Meshes" },
          detail: { name: "Mesh详情" },
          create: { name: "新建Mesh" },
        },
      },
      openapi: {
        name: "Open API ∣ 开放接口",
        dashboard: { name: "看板" },
        upstreams: { name: "服务提供者" },
        topology: { name: "拓扑" },
        api: {
          list: { name: "API" },
          detail: { name: "API详情" },
          create: { name: "新建API" },
        },
        policy: {
          list: { name: "策略" },
          detail: { name: "策略详情" },
          create: { name: "新建策略" },
        },
        application: {
          list: { name: "服务消费者" },
          detail: { name: "消费者详情" },
          create: { name: "新建消费者" },
        },
        service: { market: { name: "服务市场" } },
        subscription: { list: { name: "订阅" } },
        consumer: { list: { name: "消费者" } },
      },
      "user-center": {
        name: "User Center ∣ 用户中心",
        info: { name: "用户中心" },
      },
      "ops-center": {
        name: "Ops Center ∣ 运维中心",
        log: { name: "日志" },
        events: { name: "操作记录" },
        components: { name: "组件管理" },
        plugins: { name: "插件" },
        registry: {
          list: { name: "注册中心" },
          detail: { name: "注册详情" },
          create: { name: "新的注册" },
        },
        certificates: { name: "证书管理" },
        alarm: {
          list: { name: "告警配置" },
          detail: { name: "告警规则" },
          create: { name: "新建告警规则" },
        },
      },
      inspector: {
        name: "Inspector ∣ 检查工具",
        healthcheck: {
          list: { name: "健康检查-配置" },
          detail: { name: "健康检查详情" },
          create: { name: "新建健康检查" },
        },
        checkpoint: {
          list: { name: "健康检查-拨测" },
          detail: { name: "拨测详情" },
          create: { name: "新建拨测" },
        },
        testcase: {
          list: { name: "Fortio-测试用例" },
          detail: { name: "测试用例详情" },
          create: { name: "新建测试用例" },
          edit: { name: "编辑测试用例" },
        },
        testreport: {
          list: { name: "Fortio-测试报告" },
        },
        targets: { name: "测试目标" },
      },
      workload: {
        dashboard: { name: "看板" },
        name: "Workload ∣ 计算资源",
        cronjob: {
          list: { name: "定时任务" },
          detail: { name: "定时任务详情" },
        },
        daemonset: {
          list: { name: "守护进程组" },
          detail: { name: "守护进程详情" },
        },
        deployment: {
          list: { name: "部署组" },
          detail: { name: "部署组详情" },
        },
        job: {
          list: { name: "任务" },
          detail: { name: "任务详情" },
        },
        pod: {
          list: { name: "Pods" },
          detail: { name: "Pod详情" },
        },
        replicaset: {
          list: { name: "副本集" },
          detail: { name: "副本详情" },
        },
        "replication-controller": {
          list: { name: "复制控制器" },
          detail: { name: "复制控制器详情" },
        },
        statefulset: {
          list: { name: "有状态组" },
          detail: { name: "有状态组详情" },
        },
        secret: {
          list: { name: "密钥" },
          detail: { name: "密钥详情" },
        },
      },
      system: {
        name: "Sys Setting ∣ 系统设置",
        "topology-editor": { name: "拓扑编辑器" },
        widget: { 
					list: { name: "UI组件" },
					creator: { name: "UI组件编辑器" },
					editor: { name: "UI组件编辑器" },
					preview: { name: "UI组件预览" },
				},
        users: { name: "用户管理" },
        roles: { name: "角色管理" },
        organizations: {
          list: { name: "组织" },
          detail: { name: "组织 详情" },
        },
        projects: {
          list: { name: "项目" },
          detail: { name: "项目详情" },
          create: { name: "新建项目" },
        },
        dashboard: {
          list: { name: "定制仪表盘" },
          detail: { name: "仪表盘详情" },
          create: { name: "新建仪表盘" },
        },
      },
      "router-setting": { name: "动态菜单" },
    },
    US: {
      name: "Flomesh",
      home: { name: "Dashboard" },
      login: { name: "Login" },
      workplace: { name: "Workplace" },
      flb: {
        name: "Load Balancer",
        dashboard: { name: "Dashboard" },
        "4lb": {
          list: { name: "4 Load Balancer" },
          detail: { name: "4 Load Balancer Detail" },
          create: { name: "New 4LB" },
        },
        "7lb": {
          list: { name: "7 Load Balancer" },
          detail: { name: "7 Load Balancer Detail" },
          create: { name: "New 7LB" },
        },
        address: {
          list: { name: "Address Pool" },
          detail: { name: "Address Pool Detail" },
          create: { name: "New Address Pool" },
        },
        cluster: {
          list: { name: "LB Cluster" },
          detail: { name: "Cluster Detail" },
        },
        node: {
          detail: { name: "Node Detail" },
        },
        profile: {
          list: { name: "Profiles" },
          detail: { name: "Profiles Detail" },
          create: { name: "New Profiles" },
        },
        lbevent: {
          list: { name: "LB Event" },
        },
      },
      fsm: {
        name: "Service Mesh",
        dashboard: { name: "Dashboard" },
        ingress: {
          list: { name: "Ingress" },
          detail: { name: "Ingress Detail" },
          create: { name: "Create Ingress" },
        },
        egress: {
          list: { name: "Egress" },
          detail: { name: "Egress Detail" },
          create: { name: "Create Egress" },
        },
        sidecar: {
          list: { name: "Sidecars" },
          detail: { name: "Sidecar Detail" },
          create: { name: "New Sidecar" },
        },
        topology: { name: "Topology" },
        waterfall: {
          list: { name: "Waterfall" },
          detail: { name: "Waterfall Detail" },
        },
        service: {
          list: { name: "Services" },
          detail: { name: "Service Detail" },
          create: { name: "New Services" },
          imports: { name: "Svc Imports" },
        },
        vCluster: {
          list: { name: "Virtual Service Clusters" },
          detail: { name: "Virtual Service Cluster Detail" },
        },
        mesh: {
          list: { name: "Meshes" },
          detail: { name: "Mesh Detail" },
          create: { name: "Create Mesh" },
        },
      },
      openapi: {
        name: "Open API",
        dashboard: { name: "Dashboard" },
        upstreams: { name: "Providers" },
        topology: { name: "Topology" },
        api: {
          list: { name: "API" },
          detail: { name: "API Detail" },
          create: { name: "Create API" },
        },
        policy: {
          list: { name: "Policy" },
          detail: { name: "Policy Detail" },
          create: { name: "Create Policy" },
        },
        application: {
          list: { name: "Consumers" },
          detail: { name: "Consumer Detail" },
          create: { name: "Create Consumers" },
        },
        service: { market: { name: "Service Market" } },
        subscription: { list: { name: "Subscription" } },
        consumer: { list: { name: "Consumer" } },
      },
      "user-center": {
        name: "User Center",
        info: { name: "User Center" },
      },
      "ops-center": {
        name: "Ops Center",
        log: { name: "Log" },
        events: { name: "Events" },
        components: { name: "Components" },
        plugins: { name: "Plugins" },
        registry: {
          list: { name: "Registry" },
          detail: { name: "Registry Detail" },
          create: { name: "New Regist" },
        },
        certificates: { name: "Certificates" },
        alarm: {
          list: { name: "Alarm Config" },
          detail: { name: "Alarm Rule" },
          create: { name: "Create Alarm Rule" },
        },
      },
      workload: {
        name: "Workload",
        dashboard: { name: "Dashboard" },
        cronjob: {
          list: { name: "Cron Jobs" },
          detail: { name: "Cron Job Detail" },
        },
        daemonset: {
          list: { name: "Daemon Sets" },
          detail: { name: "Daemon Set Detail" },
        },
        deployment: {
          list: { name: "Deployments" },
          detail: { name: "Deployment Detail" },
        },
        job: {
          list: { name: "Jobs" },
          detail: { name: "Job Detail" },
        },
        pod: {
          list: { name: "Pods" },
          detail: { name: "Pod Detail" },
        },
        replicaset: {
          list: { name: "Replica Sets" },
          detail: { name: "Replica Set Detail" },
        },
        "replication-controller": {
          list: { name: "Replications" },
          detail: { name: "Replication Controller Detail" },
        },
        statefulset: {
          list: { name: "Stateful Sets" },
          detail: { name: "Stateful Set Detail" },
        },
        secret: {
          list: { name: "Secrets" },
          detail: { name: "Secret Detail" },
        },
      },
      inspector: {
        name: "Inspector",
        healthcheck: {
          list: { name: "HC Config" },
          detail: { name: "Healthcheck Detail" },
          create: { name: "Create Healthchecks" },
        },
        checkpoint: {
          list: { name: "HC Dial Test" },
          detail: { name: "Dial Test Detail" },
          create: { name: "Create Dial Test" },
        },
        testcase: {
          list: { name: "Fortio Testcase" },
          detail: { name: "Testcase Detail" },
          create: { name: "Create Testcase" },
          edit: { name: "Edit Testcase" },
        },
        testreport: {
          list: { name: "Fortio Report" },
        },
        targets: { name: "Test Targets" },
      },
      system: {
        name: "System",
        "topology-editor": { name: "Topology Editor" },
        widget: { 
					list: { name: "UI Widgets" },
					creator: { name: "UI Widget Creator" },
					editor: { name: "UI Widget Editor" },
					preview: { name: "UI Widget Preview" },
				},
        users: { name: "Users" },
        roles: { name: "Roles" },
        organizations: {
          list: { name: "Organizations" },
          detail: { name: "Organization Detail" },
        },
        projects: {
          list: { name: "Projects" },
          detail: { name: "Project Detail" },
          create: { name: "Create Project" },
        },
        dashboard: {
          list: { name: "Dashboards" },
          detail: { name: "Dashboard Detail" },
          create: { name: "Dashboard Project" },
        },
      },
      "router-setting": { name: "Router Setting" },
    },
    JP: {
      name: "Flomesh",
      Menu: "メニュー",
      Registry: "レジストリ",
      "Edit Menu": "エディットメニュー",
      home: { name: "ダッシュボード" },
      login: { name: "ログイン" },
      workplace: { name: "ワークプレス" },
      flb: {
        name: "FLB | ソフト負荷",
        dashboard: { name: "ダッシュボード" },
        "4lb": {
          list: { name: "4LB" },
          detail: { name: "4LB 詳細" },
          create: { name: "新規 4LB" },
        },
        "7lb": {
          list: { name: "7LB" },
          detail: { name: "7LB 詳細" },
          create: { name: "新規 7LB" },
        },
        address: {
          list: { name: "アドレス帳" },
          detail: { name: "アドレス帳の詳細" },
          create: { name: "新しいアドレス帳" },
        },
        cluster: {
          list: { name: "LBクラスタ" },
          detail: { name: "クラスタ詳細" },
        },
        zone: {
          list: { name: "LBパーティション" },
          detail: { name: "パーティション詳細" },
        },
        node: {
          detail: { name: "ノード詳細" },
        },
        profile: {
          list: { name: "設定ファイル" },
          detail: { name: "プロファイル詳細" },
          create: { name: "新しい設定" },
        },
        lbevent: {
          list: { name: "LB操作履歴" },
        },
      },
      fsm: {
        name: "FSM | サービスグリッド",
        dashboard: { name: "ダッシュボード" },
        sidecar: {
          list: { name: "サイドカー" },
          detail: { name: "サイドカー详情" },
          create: { name: "新規サイドカー" },
        },
        topology: { name: "トポロジ" },
        waterfall: {
          list: { name: "タイミング" },
          detail: { name: "タイミング詳細" },
        },
        service: {
          list: { name: "サービス" },
          detail: { name: "サービス詳細" },
          create: { name: "新規サービス" },
          imports: { name: "サービスインレット" },
        },
        ingress: {
          list: { name: "入倉リッド" },
          detail: { name: "入倉詳細" },
          create: { name: "新規入倉" },
        },
        egress: {
          list: { name: "出倉リッド" },
          detail: { name: "出倉詳細" },
          create: { name: "新規出倉" },
        },
        vCluster: {
          list: { name: "バーチャルクラスタ" },
          detail: { name: "バーチャルクラスタの詳細" },
        },
        mesh: {
          list: { name: "Meshes" },
          detail: { name: "Mesh詳細" },
          create: { name: "新規Mesh" },
        },
      },
      "user-center": {
        name: "ユーザーセンター",
        info: { name: "ユーザーセンター" },
      },
      "ops-center": {
        name: "ンテナンスセンター",
        log: { name: "ログ" },
        events: { name: "操作履歴" },
        components: { name: "コンポーネント" },
        plugins: { name: "プラグイン" },
        registry: {
          list: { name: "レジストリ" },
          detail: { name: "レジストリ詳細" },
          create: { name: "新規レジストリ" },
        },
        certificates: { name: "証明書" },
        alarm: {
          list: { name: "アラーム設定" },
          detail: { name: "アラームルール" },
          create: { name: "新規アラームルール" },
        },
      },
      workload: {
        dashboard: { name: "ダッシュボード" },
        name: "ワークロード",
        cronjob: {
          list: { name: "計画任務" },
          detail: { name: "計画任務詳細" },
        },
        daemonset: {
          list: { name: "デーモングループ" },
          detail: { name: "デーモングループ詳細" },
        },
        deployment: {
          list: { name: "デプロイメントグループ" },
          detail: { name: "デプロイメントグループ詳細" },
        },
        job: {
          list: { name: "ジョブ" },
          detail: { name: "ジョブ詳細" },
        },
        pod: {
          list: { name: "Pods" },
          detail: { name: "Pod詳細" },
        },
        replicaset: {
          list: { name: "コピーセット" },
          detail: { name: "コピー詳細" },
        },
        "replication-controller": {
          list: { name: "レプリケーションコントローラ" },
          detail: { name: "レプリケーションコントローラ詳細" },
        },
        statefulset: {
          list: { name: "状態設定セット" },
          detail: { name: "状態設定詳細" },
        },
        secret: {
          list: { name: "暗号化セット" },
          detail: { name: "暗号化詳細" },
        },
      },
      inspector: {
        name: "診断ツール",
        healthcheck: {
          list: { name: "健康診断設定" },
          detail: { name: "健康診断詳細" },
          create: { name: "新規健康診断" },
        },
        checkpoint: {
          list: { name: "チェックポイント" },
          detail: { name: "チェックポイント詳細" },
          create: { name: "新規チェックポイント" },
        },
        testcase: {
          list: { name: "Fortio テストケース" },
          detail: { name: "テストケース詳細" },
          create: { name: "新規テストケース" },
          edit: { name: "編集テストケース" },
        },
        testreport: {
          list: { name: "Fortio テストレポート" },
        },
        targets: { name: "テストターゲット" },
      },
      openapi: {
        name: "オープンAPI",
        dashboard: { name: "ダッシュボード" },
        upstreams: { name: "サービスプロバイダ" },
        topology: { name: "トポロジ" },
        api: {
          list: { name: "API" },
          detail: { name: "API詳細" },
          create: { name: "新規API" },
        },
        policy: {
          list: { name: "ポリシー" },
          detail: { name: "ポリシー詳細" },
          create: { name: "新規ポリシー" },
        },
        application: {
          list: { name: "サービス消費者" },
          detail: { name: "消費者詳細" },
          create: { name: "新規消費者" },
        },
        service: { market: { name: "サービス市場" } },
        subscription: { list: { name: "サブスクリプション" } },
        consumer: { list: { name: "消費者" } },
      },
      system: {
        name: "システム",
        "topology-editor": { name: "トポロジーエディタ" },
        widget: { 
					list: { name: "UIコンポーネント" },
					creator: { name: "UIコンポーネント編集" },
					editor: { name: "UIコンポーネント編集" },
					preview: { name: "UIコンポーネントプレビュー" },
				},
        users: { name: "ユーザー管理" },
        roles: { name: "キャラクター管理" },
        organizations: {
          list: { name: "組織" },
          detail: { name: "組織詳細" },
        },
        projects: {
          list: { name: "プロジェクト" },
          detail: { name: "プロジェクト詳細" },
          create: { name: "新規プロジェクト" },
        },
        dashboard: {
          list: { name: "カスタムダッシュボード" },
          detail: { name: "ダッシュボード詳細" },
          create: { name: "新規ダッシュボード" },
        },
      },
      "router-setting": { name: "ダイナミックメニュー" },
    },
  },
};
