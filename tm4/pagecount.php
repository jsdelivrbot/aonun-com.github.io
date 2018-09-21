<?php
$datafile = 'pagecount.data.php';
@include $datafile;
if(empty($pagecount)) $pagecount=1;
file_put_contents($datafile, '<?php $pagecount='.($pagecount+1).';?>');
