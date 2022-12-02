【getServices】
select svc_name,count() as count from log_req_mv where timestamp < now() - interval ${this.endDate} and timestamp >now() - interval ${this.date} group by svc_name order by svc_name;
【getPods】
select pod_ip,pod_name,svc_name,count() as count from log_req_mv where timestamp < now() - interval ${this.endDate} and timestamp >now() - interval ${this.date} group by pod_ip,pod_name,svc_name order by svc_name,pod_ip;
【getPaths】
select remote_addr,local_addr,svc_name, count() as count from log_req_mv where timestamp < now() - interval ${this.endDate} and timestamp >now() - interval ${this.date} group by remote_addr,local_addr,svc_name order by svc_name,remote_addr;
【chart1】
select count() as count ,count(CASE WHEN resp.status<'400' THEN 1 END) as succss_count ,count(CASE WHEN resp.status>='400' THEN 1 END) as error_count ,toStartOfMinute(toDateTime(time/1000000)) as min from log_full_v where 1=1 ${_where} group by min order by min;
【chart2】
select count() as count,resp.status from log_full_v where 1=1 ${_where} group by resp.status order by resp.status
【chart3】
select (ceil((resp.time - time)/1000000*2)/2) as latency ,count() as count  from log_full_v where resp.time > 0 ${_where} group by latency;
【chart4】
select time/1000 as x,((resp.time - time)/1000) as latency,resp.status from log_full_v where resp.time > 0 ${_where};