
echo "Executing VEGGIES shutdown\n"

echo '- Shutting down EC2 instance\n'
aws ec2 stop-instances --instance-ids i-0b230e6ce9f1c3c6e --profile personal --region us-east-1 >> aws_log.txt
echo
echo '- Shutting down RDS instance ... \n'
aws rds stop-db-instance --db-instance-identifier veggies --profile personal --region us-east-1 >> aws_log.txt
echo
echo "- Waiting for 3 min for RDS instance to shutdown"
secs=$((3 * 60))
while [ $secs -gt 0 ]; do
  echo "- timer: $secs\r\c"
  sleep 1
  : $((secs--))
done

STATUS=$(aws rds describe-db-instances --db-instance-identifier veggies --profile personal --region us-east-1 --query 'DBInstances[0].DBInstanceStatus')
until [ $STATUS = '"stopped"' ]; do
    echo "- RDS shutdown NOT complete, waiting ..."
    secs=$((30))
    while [ $secs -gt 0 ]; do
      echo "- timer: $secs\r\c"
      sleep 1
      : $((secs--))
    done
    STATUS=$(aws rds describe-db-instances --db-instance-identifier veggies --profile personal --region us-east-1 --query 'DBInstances[0].DBInstanceStatus');
done

echo "- RDS instance stopped"
echo "- VEGGIES shutdown complete\n"


if (( $SECONDS > 3600 )) ; then
    let "hours=SECONDS/3600"
    let "minutes=(SECONDS%3600)/60"
    let "seconds=(SECONDS%3600)%60"
    echo "Completed in $hours hour(s), $minutes minute(s) and $seconds second(s)"
elif (( $SECONDS > 60 )) ; then
    let "minutes=(SECONDS%3600)/60"
    let "seconds=(SECONDS%3600)%60"
    echo "Completed in $minutes minute(s) and $seconds second(s)"
else
    echo "Completed in $SECONDS seconds"
fi
exit 0
