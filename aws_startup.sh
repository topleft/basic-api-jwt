#!/bin/bash

echo
echo Executing VEGGIES startup \\n\\n
echo Starting RDS instance \\n
aws rds start-db-instance --db-instance-identifier veggies --profile personal --region us-east-1 >> aws_log.txt
echo "- RDS startup command executed -"
echo "- WAITING 5 min for RDS instance to become available ..."
secs=$((5 * 60))
while [ $secs -gt 0 ]; do
  echo "- timer: $secs\r\c"
  sleep 1
  : $((secs--));
done

STATUS=$(aws rds describe-db-instances --db-instance-identifier veggies --profile personal --region us-east-1 --query 'DBInstances[0].DBInstanceStatus')
until [ $STATUS = '"available"' ]; do
  echo "- RDS instance still unavailable, current status: $STATUS"
  echo "- retry in 30 seconds"

  secs=$((30))
  while [ $secs -gt 0 ]; do
    echo "- timer: $secs\r\c"
    sleep 1
    : $((secs--));
  done
  STATUS=$(aws rds describe-db-instances --db-instance-identifier veggies --profile personal --region us-east-1 --query 'DBInstances[0].DBInstanceStatus');
done

echo "- RDS instance ready!"
echo "- Starting EC2 instance ..."
aws ec2 start-instances --instance-ids i-0b230e6ce9f1c3c6e --profile personal --region us-east-1
echo "- Waiting 20 seconds for EC2 instance to startup ..."
sleep 20
STATUS=$(aws ec2 describe-instances --instance-ids i-0b230e6ce9f1c3c6e --profile personal --region us-east-1 --query 'Reservations[0].Instances[0].State.Name')
echo "- EC2 instance current status: $STATUS"
until [ $STATUS = '"running"' ]; do
  echo "- EC2 instance still unavailable, current status: $STATUS"
  echo "- retry in 20 seconds"
  secs=$((20))
  while [ $secs -gt 0 ]; do
    echo "- timer: $secs\r\c"
    sleep 1
    : $((secs--));
  done
  STATUS=$(aws ec2 describe-instances --instance-ids i-0b230e6ce9f1c3c6e --profile personal --region us-east-1 --query 'Reservations[0].Instances[0].State.Name');
done
echo "\n- EC2 instance ready!\n"
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
