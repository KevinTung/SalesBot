import requests

url = "http://106.53.98.199/feishu/swagger/testchange"

payload = "{ \n    \"challenge\": \"ajls384kdjx98XX\", \n    \"token\": \"xxxxxx\",              \n    \"type\": \"url_verification\"       \n} "
headers = {
  'Authorization': 'Bearer t-e736847e2f19532df4945cb879da7892a25e3d82',
  'Content-Type': 'application/json; charset=utf-8',
  'Cookie': 'JSESSIONID=dfeef1b6-3029-4e9b-a733-943651db1840'
}

response = requests.request("POST", url, headers=headers, data=payload)

print(response.text)
