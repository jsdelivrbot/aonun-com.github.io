<?php


function filename_filter($name='TEST') {
	return preg_replace( '/["\s\\\'\/:*?$&\{\}<>\|\.]+/',  '_',  $name);
}

