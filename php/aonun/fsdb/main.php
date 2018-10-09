<?php
namespace aonun\fsdb;

require_once __DIR__.'/objectbase.php';// 基本类
require_once __DIR__.'/database.php';
require_once __DIR__.'/collection.php';
require_once __DIR__.'/../fs.php';
require_once __DIR__.'/../util.php';


// 创建数据库，当前文件目录下创建目录db，创建数据库文件test.db
// $d=new Database();// aonun\fsdb\Database {}
// var_dump($test->opt('file'));// db\test.db
// var_dump($test->opt('path'));// db\
// var_dump($test->opt('name'));// test
// var_dump($test->getFile());// db\test.db
// var_dump($test->getPath());// db\
// var_dump($test->getName());// test
// var_dump($test->opt('pdo'));// \PDO {}
// var_dump(Database::$cache);// 被缓存的PDO们。
// $d->remove();
// var_dump($d->all());// 
// var_dump($d->tables());// 同上
// var_dump($d->collections());// 同上
// var_dump($d->getTables());// 同上
// var_dump($d->getCollections());// 同上


// 创建日志式的表
// $t=$d->t;// 默认为日志模式，即 k 字段不是 primary key。
// $t=$d->collection('m',false);// 同上
// var_dump($t->opt('database'));// aonun\fsdb\Database {}
// var_dump($t->opt('name'));// t
// var_dump($t->opt('id'));// aonun\fsdb\Collection {}
// var_dump($t->opt('primary'));// true
// var_dump($t->opt('pdo'));// \PDO {}
// var_dump($t->opt('primary'));// false



// $t->username='김희동';
// $t->password='123456';
// var_dump($t->like('t>0',100,2));// 条件和个数
// var_dump($t->all());
// var_dump($t->get('username',true));
// $t->remove();// 删除该表，内部调用Drop语句命令。


// 创建唯一键的表
// $pt=$d->collection('m');// 创建表 m，并且 k 字段是 primary key。
// var_dump($pt->opt('name'));// "m"
// var_dump($pt->opt('primary'));// true
// $pt->a='김희동';// rowid会被刷新，旧的冲突记录会被删除。
// var_dump($pt->like('k="username" AND t>0',true));// 由于是pk表，所以$log=true也只有一个内容。
// var_dump($pt->all());
// var_dump($pt->get('username',true));// 由于是pk表，所以$log=true也只有一个内容。
// var_dump($pt->username);// 同上
// $pt->remove();// 删除该表，内部调用Drop语句命令。
// var_dump($pt->opt('pri',1));// false
// var_dump($pt->all(true));
// var_dump($pt->a);
// var_dump($pt->all(true));// 由于PrimayKey是true，不是日志式记录，所以永远只有1条记录可选。
// $d->vacuum();

// $pt->remove();// 删除该表，内部调用Drop语句命令。


// $test->opt('name','test2');
// var_dump($test->opt('name'));// test
// var_dump($test->opt('file'));// test

// $test2=new Database('name');

// var_dump($test2->opt('pdo'));

