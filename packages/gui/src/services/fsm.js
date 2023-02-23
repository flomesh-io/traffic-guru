import { query } from "@/services/graphql";
import { DefaultChartDate } from "./tools";

export async function getServicesSummary() {
  return query(`getFsmDashboardPageInfo(filters: $filters){
		services{total,include,exclude}
	}`,{filters:DefaultChartDate});
}

export async function getNamespacesSummary() {
  return query(`namespaces{
		meta{pagination{total}}
	}`);
}

export async function getRegistriesSummary() {
  return query(`getFsmDashboardPageInfo(filters: $filters){
		registries{total,valid,invalid}
	}`,{filters:DefaultChartDate});
}

export async function getHealthchecksChart() {
	let filters = DefaultChartDate;
	filters.type = "service";
  return query(`getHealthcheckDashboardPageInfo(filters: $filters){
		healthchecks_timer
	}`,{filters});
}

export async function getServicesHealthSummary() {
	let filters = DefaultChartDate;
	filters.type = "service";
  return query(`getHealthcheckDashboardPageInfo(filters: $filters){
		healthchecks{health,unhealthy}
	}`,{filters});
}

export async function getIngressHealthSummary() {
	let filters = DefaultChartDate;
	filters.type = "ingress";
  return query(`getHealthcheckDashboardPageInfo(filters: $filters){
		healthchecks{health,unhealthy}
	}`,{filters});
}

export async function getTopoSvc() {
  return query(`registries(pagination:{start: 0,limit: 9999}){data{id,attributes{
		name,
		type,
		namespaces{data{id,attributes{
			name,
			services{data{id,attributes{
				name,
				registry{data{id,attributes{name}}},
				serviceExport{data{id,attributes{
					serviceImports{data{id,attributes{
						registry{data{id,attributes{name}}},
						content
					}}}
				}}}
			}}},
			bindMesh{data{id,attributes{name}}}
		}}}
	}}}`);
}
function createTopoNode(config){
	return {
		...config,
		label: {
			normal: {
				show: config.showLabel,
				width: 140,
				overflow: "truncate",
				ellipsis: "...",
				position: config.type == "registry"?"center":"bottom",
			},
		}
	}
}
function createTopoLink(config){
	return {
		...config,
		symbol: ["none", config.type == "namespace"?"circle":"arrow"],
		symbolSize: [10, 5],
		lineStyle: {
			opacity : config.type == "namespace"? 0.2:(config.type == "exp"?0.2:1),
			type: config.type == "exp"?"solid": "dashed",
			curveness: config.type == "exp"?0.3:0,
			width: config.type == "exp"?3:1
		},
		label: {
			show: config.showLabel,
			position: 'end',
			backgroundColor: "#cccccc",
			padding: 2,
			borderRadius: 3,
			fontSize: 10,
			color: "#000000",
			formatter: "{@value}",
		},
	}
}
export function setTopoSvcData(d){
	let _d = d.data;
	let nodes = [];
	let links = [];
  let categories = [];
	let registry_svg = require("@/assets/img/registry.svg");
	categories.push({
			id: 'Registry',
			name: 'Registry',
			icon: `image://${registry_svg}`,
			itemStyle: {
				color:'#00adef',
			}
	});
	categories.push({
			id: 'Namespace',
			name: 'Namespace',
			icon: 'circle',
			itemStyle: {
				color:'#00adef',
			}
	});
	categories.push({
			id: 'Mesh NS',
			name: 'Mesh NS',
			icon: 'rect',
			itemStyle: {
				color:'#00adef',
			}
	});
	categories.push({
			id: 'Service',
			name: 'Service',
			icon: 'pin',
			itemStyle: {
				color:'#00adef',
			}
	});
	categories.push({
			id: 'Import Service',
			name: 'Import Service',
			icon: 'arrow',
			itemStyle: {
				color:'#00adef',
			}
	});
	_d.forEach((registry)=>{
		registry.namespaces.forEach((namespace)=>{
			namespace.services.forEach((service)=>{
				if(service.serviceExport){
					service.type = 'exp';
					if(service.serviceExport.serviceImports){
						service.serviceExport.serviceImports.forEach((serviceImport)=>{
							let registry2Idx = _d.findIndex((registry2)=>registry2.id==serviceImport.registry.id);
							let namespace2Idx = _d[registry2Idx].namespaces.findIndex((namespace2)=>namespace2.name==namespace.name);
							if(namespace2Idx >= 0){
								if(!_d[registry2Idx].namespaces[namespace2Idx].services){
									_d[registry2Idx].namespaces[namespace2Idx].services = [];
								}
								let service2Id = `${serviceImport.registry.name}-${serviceImport.id}`;
								let service2Idx = _d[registry2Idx].namespaces[namespace2Idx].services.findIndex(
									(service2)=>service2.id==service2Id
								);
								if(service2Idx == -1){
									_d[registry2Idx].namespaces[namespace2Idx].services.push({
										type:'imp',
										id:service2Id,
										name:service.name,
										exports:[service]
									});
								}else{
									_d[registry2Idx].namespaces[namespace2Idx].services[service2Idx].exports.push(service);
								}
							}
						})
					}
				}else if(!service.type){
					service.type = 'svc';
				}
			})
		})
	});
	let r = 1200;
	if(_d.length > 0){
		let s = _d.length > 1?6:0;
		_d.forEach((registry,regIdx)=>{
			let reg_pos = setTopoSvcPos(_d.length,regIdx,[0,0,0],r);
			reg_pos[0] = reg_pos[0] * s;
			reg_pos[1] = reg_pos[1] * s;
			nodes.push(createTopoNode({
				id:registry.name,
				name:`[${registry.type}] ${registry.name}`,
				showLabel: true,
				x:reg_pos[0],
				y:reg_pos[1],
				symbolSize: 30,
				type:"registry",
				symbol: `image://${registry_svg}`,
				category: registry.name,
			}));
			categories.push({
				id:registry.name,
				name:registry.name,
			});
			if(registry.namespaces.length > 0){
				let q = 40;
				let first_ns_pos = setTopoSvcPos(registry.namespaces.length,0,reg_pos,r);
				let relativeQ = [q*(first_ns_pos[0]-reg_pos[0]),q*(first_ns_pos[1]-reg_pos[1])];
				registry.namespaces.forEach((namespace,nsIdx)=>{
					let ns_pos = setTopoSvcPos(registry.namespaces.length,nsIdx,reg_pos,8*r);
					ns_pos[0] += relativeQ[0];
					ns_pos[1] += relativeQ[1];
					let ns_mesh = namespace.bindMesh?.name;
					nodes.push(createTopoNode({
						id:`${registry.name}-${namespace.id}`,
						name:`[ns] ${namespace.name}`,
						x:ns_pos[0],
						y:ns_pos[1],
						showLabel: false,
						type:'namespace',
						mesh:ns_mesh,
						parent:registry.name,
						symbolSize: namespace.services.length*2>10?10:(namespace.services.length<7?7:namespace.services.length),
						symbol: !!ns_mesh ? "rect":"circle",
						category: registry.name,
					}));
					links.push(createTopoLink({
						source:registry.name,
						target:`${registry.name}-${namespace.id}`,
						type:'namespace',
						name:`[${registry.type}] ${registry.name} > [ns] ${namespace.name}`,
						showLabel: !!ns_mesh,
						value: ns_mesh
					}));
					if(namespace.services.length > 0){
						let t = namespace.services.length > 1?22:20;
						let first_svc_pos = setTopoSvcPos(namespace.services.length,0,ns_pos,r);
						let relative = [t*(first_svc_pos[0]-ns_pos[0]),t*(first_svc_pos[1]-ns_pos[1])];
						namespace.services.forEach((service,sIdx)=>{
							let svc_pos = setTopoSvcPos(namespace.services.length,sIdx,ns_pos,4*r);
							svc_pos[0] += relative[0];
							svc_pos[1] += relative[1];
							service.type = service.type || 'svc';
							nodes.push(createTopoNode({
								id:`svc-${service.id}`,
								name:`[${service.type}] ${service.name}`,
								type:service.type,
								x:svc_pos[0],
								y:svc_pos[1],
								showLabel: service.type != 'svc' || namespace.services.length <= 2,
								parent:`${registry.name}-${namespace.id}`,
								symbolSize: 15,
								symbol: service.type != "imp" ? "pin":"arrow",
								category: registry.name,
							}));
							links.push(createTopoLink({
								source:`${registry.name}-${namespace.id}`,
								name:`[ns] ${namespace.name} > [${service.type}] ${service.name}`,
								type:'svc',
								target:`svc-${service.id}`
							}));
							if(service.type == "imp"){
								service.exports.forEach((_export)=>{
									links.push(createTopoLink({
										source:`svc-${_export.id}`,
										name:`[exp] ${_export.registry.name}:${service.name} > [${service.type}] ${registry.name}:${service.name}`,
										target:`svc-${service.id}`,
										type:'exp',
										showLabel: true,
										value: 'imp'
									}));
								})
							}
						})
					}
				})
			}
		});
	}
  return { categories, nodes, links, state: nodes.length || 0 };
}
export function setTopoSvcPos(size, idx, start, r ){
	let angleUnit = Math.floor(360/(size == 2?3:size));
	let newAngle = angleUnit*idx + start[2];
	return [
		start[0] + r * Math.cos((newAngle) * Math.PI / 180),
		start[1] + r * Math.sin((newAngle) * Math.PI / 180),
		newAngle,
	]
}
export default {
  getServicesSummary,
  getRegistriesSummary,
  getNamespacesSummary,
  getHealthchecksChart,
  getServicesHealthSummary,
  getIngressHealthSummary,
	getTopoSvc,
	setTopoSvcData
};
