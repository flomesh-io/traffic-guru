import MiniArea from "@/components/chart/MiniArea";
import MiniBar from "@/components/chart/MiniBar";
import MiniSector from "@/components/chart/MiniSector";
import Gauge from "@/components/chart/Gauge";
import RingStatus from "@/components/chart/RingStatus";
import RankingGroup from "@/components/chart/RankingGroup";
import TotalChart from "@/components/chart/TotalChart";

//flb
import BarChart from "@/components/chart/BarChart";
import BarGroupChart from "@/components/chart/BarGroupChart";

//fsm
import TopologyChart from "@/components/chart/fsm/TopologyChart";
import AreaChart from "@/components/chart/fsm/AreaChart";
import BpsChart from "@/components/chart/fsm/BpsChart";
import DelayChart from "@/components/chart/fsm/DelayChart";
import QoSSummaryChart from "@/components/chart/fsm/QoSSummaryChart";
import StatusChart from "@/components/chart/fsm/StatusChart";
import Sankey from "@/components/chart/Sankey";

const baseComponents = {
  TopologyChart: {
    icon: "icon-component",
    component: TopologyChart,
    provide: "custom",
    isOpen: false,
    callback: `res => {
    /*TODO*/
    return {
			where:''
    }
}`,
  },
  AreaChart: {
    icon: "icon-component",
    provide: "custom",
    component: AreaChart,
    isOpen: false,
    callback: `res => {
    /*TODO*/
    return {
    }
}`,
  },
  BpsChart: {
    icon: "icon-component",
    provide: "custom",
    component: BpsChart,
    isOpen: false,
    callback: `res => {
    /*TODO*/
    return {
    }
}`,
  },
  DelayChart: {
    icon: "icon-component",
    component: DelayChart,
    provide: "custom",
    isOpen: false,
    callback: `res => {
    /*TODO*/
    return {
    }
}`,
  },
  QoSSummaryChart: {
    icon: "icon-component",
    provide: "custom",
    isOpen: false,
    component: QoSSummaryChart,
    callback: `res => {
    /*TODO*/
    return {
    }
}`,
  },
  StatusChart: {
    icon: "icon-component",
    provide: "custom",
    isOpen: false,
    component: StatusChart,
    callback: `res => {
    /*TODO*/
    return {
    }
}`,
  },
  TotalChart: {
    icon: "icon-lbtotal",
    provide: "custom",
    component: TotalChart,
    isOpen: true,
    callback: `res => {
    /*TODO*/
    return {
        config:{
            icon:require('@/assets/img/lb.png'),
            total:5,
            unit:'unitge',
            body:[
                {label:'Type A',value:2,unit:''},
                {label:'Type B',value:3,unit:''}
            ],
            foot:[
                {label:'activeClient',value:1},
                {label:'activeTarget',value:2}
            ]
        }
    }
}`,
  },
  BarChart: {
    icon: "icon-barchart",
    component: BarChart,
    provide: "custom",
    isOpen: false,
    callback: `res => {
    /*TODO*/
    return {
			  label:'',
        barData:[{type:'typeA',date:'xAxis',value:0}]
    }
}`,
  },
  BarGroupChart: {
    icon: "icon-barchart",
    component: BarGroupChart,
    provide: "custom",
    isOpen: false,
    callback: `res => {
    /*TODO*/
    return {
        group:{bars:[{name:'name1',amount:0,usedAmount:0}]}
    }
}`,
  },
  MiniArea: {
    icon: "icon-linechart",
    component: MiniArea,
    provide: "custom",
    isOpen: true,
    callback: `res => {
    /*TODO*/
    return {
				id: 'Test-MiniArea',
				colors: ['#8bd4a1', '#fb9690'],
				height: 240,
				padding: [0, 0, 0, 0],
				axis: false,
				unit: 'unitge',
				showy: false,
				dv:[
					{type:'typeA',date:'2022-11-11',value:20},
					{type:'typeA',date:'2022-11-12',value:30},
					{type:'typeB',date:'2022-11-11',value:30},
					{type:'typeB',date:'2022-11-12',value:60},
				]
    }
}`,
  },
  MiniBar: {
    icon: "icon-barchart",
    component: MiniBar,
    provide: "custom",
    isOpen: true,
    callback: `res => {
    /*TODO*/
    return {
			id: 'Test-MiniBar',
			height: 240,
			axis: false,
			dv:[{type:'typeA',date:'type1',value:10}]
    }
}`,
  },
  MiniSector: {
    icon: "icon-pie",
    component: MiniSector,
    provide: "custom",
    isOpen: true,
    callback: `res => {
    /*TODO*/
    return {
        colors:['#8bd4a1','#fac858','#fb9690'],
				dv:[
					{type:'Success',value:'250',name:'Success'},
					{type:'Error',value:'150',name:'Error'},
					{type:'Warn',value:'50',name:'Warn'}
				]
    }
}`,
  },
  RankingGroup: {
    icon: "icon-top1",
    component: RankingGroup,
    provide: "custom",
    isOpen: true,
    callback: `res => {
    /*TODO*/
    return {
        tops:[
					{title:'Index A',items:[
						{title:'Type A top',list:[{name:'Item A',value:'999'},{name:'Item B',value:'888'},{name:'Item C',value:'111'}]},
						{title:'Type B top',list:[{name:'Item A',value:'999'},{name:'Item B',value:'555'},{name:'Item C',value:'333'}]},
					]},
					{title:'Index B',items:[
						{title:'Type A top',list:[{name:'Item A',value:'999'},{name:'Item B',value:'333'},{name:'Item C',value:'222'}]},
						{title:'Type B top',list:[{name:'Item A',value:'999'},{name:'Item B',value:'222'},{name:'Item C',value:'111'}]},
					]}
        ]
    }
}`,
  },
  Sankey: {
    icon: "icon-sankey",
    component: Sankey,
    provide: "custom",
    isOpen: true,
    callback: `res => {
    /*TODO*/
    return {
        fields:[{title:'typeA',value:0,unit:'unitge'},{title:'typeB',value:0,unit:'unitge'}]
    }
}`,
  },
  Gauge: {
    icon: "icon-gauge",
    component: Gauge,
    provide: "custom",
    isOpen: true,
    callback: `res => {
    /*TODO*/
    return {
        id:'XXX',
				format:'{value}',
				vals: [
					{ title:'Running',value:30,color:'#00adef' },
					{ title:'Completed',value:20,color:'#8bd4a1' },
					{ title:'Failed',value:10,color:'#fb9690' }
				],
    }
}`,
  },
  RingStatus: {
    icon: "icon-gauge",
    component: RingStatus,
    provide: "custom",
    isOpen: true,
    callback: `res => {
    /*TODO*/
    return {
        id:'XXX',
		total:1000,
		unit:'unitge',
        vals:[
            20,
            30,
        ]
    }
}`,
  },
  Space: {
    isOpen: false,
    icon: "icon-component",
  },
};

export default baseComponents;
