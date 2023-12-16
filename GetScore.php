<html>
<head><title>Add Poker Game Info!</title></head>

<body>

<?PHP

$link = mysql_connect("mysql.freepokertimer.net",'jrisi','password');
if (!$link)
  die('Not connected : ' . mysql_error());
  
$db_selected = mysql_select_db("highscorelist",$link);
if (!$db_selected)
  die('WTF: '. mysql_error());

$result = mysql_query("SELECT * FROM Names");
if (!$result)
{
  $message = 'Invalid query: ' . mysql_error() . "\n";
  $message .= 'Whole query: '. "SELECT * FROM Names";
  die($message);
}
else
{
  echo '<center>';
  echo 'High Scores<br><br>';
  $idx = 1;
  while ($row = mysql_fetch_array($result))
  {
    echo $idx.". ".$row['Name']." ".$row['Score']."<br>";
    $idx += 1;
  }
  echo '</center>';
}
?>

</body>
</html>