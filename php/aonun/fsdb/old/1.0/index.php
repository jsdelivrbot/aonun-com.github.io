<?php
header('HTTP/1.1 200 OK');
header('Content-Length:0');
header('Connection:Close');
flush();
exit();
?>