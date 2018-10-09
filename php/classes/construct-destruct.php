<?php

class T {
	function __construct() {
		echo 'created.';
	}

	function __destruct() {
		echo 'deleted.';
	}

}

new T;// created.deleted.
$t=new T;// created.
exit('exit.');// exit.deleted.