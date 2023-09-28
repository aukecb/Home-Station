#!/bin/bash

IP="127.0.0.1"
SUBJECT_CA="/C=NL/ST=Rotterdam/L=Rotterdam/O=/OU=CA/CN=$IP"
SUBJECT_SERVER="/C=NL/ST=Rotterdam/L=Rotterdam/O=/OU=Server/CN=$IP"
SUBJECT_CLIENT="/C=NL/ST=Rotterdam/L=Rotterdam/O=/OU=Client/CN=$IP"

function generate_client () {
   echo "$SUBJECT_CLIENT"
   openssl req -new -nodes -sha256 -subj "$SUBJECT_CLIENT" -out $NAME.csr -keyout $NAME.key 
   openssl x509 -req -sha256 -in $NAME.csr -CA ../ca.crt -CAkey ../ca.key -CAcreateserial -out $NAME.crt -days 365
}

echo "Enter client name:"
read -r NAME
generate_client
