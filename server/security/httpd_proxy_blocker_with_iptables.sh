#!/usr/bin/env sh
 
tail -f /var/log/httpd/access_log | awk '
BEGIN { blocked_ips="" }
/ http/ {
  if (! index(blocked_ips, $1)) {
    // append this ip to our internal blocked_ips list
    blocked_ips = blocked_ips " " $1
 
    "date" | getline current_time
    close("date")
 
    print current_time " :: blocking " $1
 
    iptables_block = "iptables -A INPUT -s " $1 " -j DROP"
    print iptables_block
    system(iptables_block)
    close(iptables_block)
  }
}'