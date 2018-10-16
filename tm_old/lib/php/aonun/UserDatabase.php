<?php
namespace fsdb;
require_once 'Database.php';

class UserDatabase extends Database{
	public function __construct($name='test') {
		parent::__construct('user_database_'.$name);
	}
	public function __get($username){
		return new User($username,$this->opt->pdo);
	}
}