<?php

// $scriptStartTime = microtime(true);

session_start();

if (!isset($_SESSION['data'])) {
	$_SESSION['data'] = array();
}

$x = @$_POST['x_value'];
$y = @$_POST['y_value'];
$r = @$_POST['r_value'];
$timezone = @$_POST['timezone'];

function validateNumber($val, $min, $max, $strict) {
	if ($strict) {
		$val = str_replace(',', '.', $val);
		return isset($val) && is_numeric($val) && ($val > $min) && ($val < $max);
	}
	return isset($val) && is_numeric($val) && ($val >= $min) && ($val <= $max);
}

function validateTimezone($timezone) {
	return isset($timezone);
}

function checkLeftArea($x, $y, $r) {
	return ($x <= 0 && $y >= 0 && ($y <= $x + $r/2));
}

function checkRightArea($x, $y, $r) {
	return ($x >= 0 && $y >= 0 && sqrt($x ** 2 + $y ** 2) <= $r/2);
}

function checkBottomArea($x, $y, $r) {
	return ($x <= 0 && $y <= 0 && $x >= -$r && $y >= -$r);
}

if (validateNumber($x, -2, 2, FALSE) && validateNumber($y, -3, 3, TRUE) && validateNumber($r, 1, 3, FALSE) && validateTimezone($timezone)) {
	$inArea = checkLeftArea($x, $y, $r) || checkRightArea($x, $y, $r) || checkBottomArea($x, $y, $r);

	$hitFact = $inArea ? 'Попадание' : 'Промах';

	$currentTime = date('d-m-Y G:i:s', time() - $timezone * 60);
	// $currentTime = date('d-m-Y G:i:s', strtotime($timezone));

	$executionTime = round(microtime(true) - $_SERVER['REQUEST_TIME_FLOAT'], 7);
	// $executionTime = round(microtime(true) - $scriptStartTime, 7);

	$answer = array('x' => $x, 'y' => $y, 'r' => $r, 'hitFact' => $hitFact, 'currentTime' => $currentTime, 'executionTime' => $executionTime);

	array_push($_SESSION['data'], $answer);
}

foreach ($_SESSION['data'] as $elem) {
	echo '<tr class="columns">';
	echo '<td>' . $elem['x'] . '</td>';
	echo '<td>' . $elem['y'] . '</td>';
	echo '<td>' . $elem['r'] . '</td>';
	echo '<td>' . $elem['hitFact']  . '</td>';
	echo '<td>' . $elem['currentTime']  . '</td>';
	echo '<td>' . $elem['executionTime'] . '</td>';
	echo '</tr>';
}

?>