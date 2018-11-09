
防火墙
```c
# 重启
firewall-cmd --reload
# 添加端口
firewall-cmd --permanent --add-port=60022/tcp
# 移除端口
firewall-cmd --permanent --remove-port=60022/tcp
# 显示当前服务
firewall-cmd --list-services
# 本机可支持的服务名列表
firewall-cmd --get-services
# 允许SSH服务通过
firewall-cmd --enable service=ssh
# 禁止SSH服务通过
firewall-cmd --disable service=ssh

```