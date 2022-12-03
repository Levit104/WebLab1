<?php

session_start();

if (!isset($_SESSION['data']))
{
	$_SESSION['data'] = array();
}

$x = @$_POST['x'];
$y = @$_POST['y'];
$r = @$_POST['r'];
$timezone = @$_POST['timezone'];

function validValue($val, $min, $max, $isStrict): bool
{
    return $isStrict ?
        isset($val) && is_numeric($val) && ($val > $min) && ($val < $max) :
        isset($val) && is_numeric($val) && ($val >= $min) && ($val <= $max);
}

function validTimezone($timezone): bool
{
	return isset($timezone);
}

function insideTriangle($x, $y, $r): bool
{
	return ($x <= 0 && $y >= 0 && ($y <= $x + $r/2));
}

function insideQuadrant($x, $y, $r): bool
{
	return ($x >= 0 && $y >= 0 && sqrt($x ** 2 + $y ** 2) <= $r/2);
}

function insideRectangle($x, $y, $r): bool
{
	return ($x <= 0 && $y <= 0 && $x >= -$r && $y >= -$r);
}

function insideArea($x, $y, $r): bool
{
    return insideTriangle($x, $y, $r) || insideQuadrant($x, $y, $r) || insideRectangle($x, $y, $r);
}

$allValid = validValue($x, -2, 2, FALSE) &&
    validValue($y, -3, 3, TRUE) &&
    validValue($r, 1, 3,FALSE) &&
    validTimezone($timezone);

if ($allValid) {
    $isInside = insideArea($x, $y, $r) ? 'Попадание' : 'Промах';

	$currentTime = date('d-m-Y G:i:s', time() - $timezone * 60);
	$executionTime = round(microtime(true) - $_SERVER['REQUEST_TIME_FLOAT'], 7);

	$answer = array('x' => $x, 'y' => $y, 'r' => $r,
        'isInside' => $isInside,
        'currentTime' => $currentTime,
        'executionTime' => $executionTime);

    $_SESSION['data'][] = $answer;
}

function fillTable(): void
{
    foreach ($_SESSION['data'] as $elem) {
        echo '<tr class="columns">';
        echo '<td>' . $elem['x'] . '</td>';
        echo '<td>' . $elem['y'] . '</td>';
        echo '<td>' . $elem['r'] . '</td>';
        echo '<td>' . $elem['isInside'] . '</td>';
        echo '<td>' . $elem['currentTime'] . '</td>';
        echo '<td>' . $elem['executionTime'] . '</td>';
        echo '</tr>';
    }
}

fillTable();

?>