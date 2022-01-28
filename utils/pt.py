from opensearchpy import OpenSearch
from opensearchpy.connection import create_ssl_context
import ssl
import json
from pygments import highlight
from pygments.lexers import JsonLexer
from pygments.formatters import TerminalFormatter
import asyncio
host = 'localhost'
port = 9200
auth = ('admin', 'admin') # For testing only. Don't store credentials in code.
ca_certs_path = "./root-ca.pem" # Provide a CA bundle if you use intermediate CAs with your root CA.

# Optional client certificates if you don't want to use HTTP basic authentication.
# client_cert_path = '/full/path/to/client.pem'
# client_key_path = '/full/path/to/client-key.pem'

# Create the client with SSL/TLS enabled, but hostname verification disabled.
def jsonPrint(response):
  json_str = json.dumps(response, indent=4, sort_keys=True)
  print(highlight(json_str, JsonLexer(), TerminalFormatter()))
  return 

ssl_context = create_ssl_context()
ssl_context.check_hostname = False
ssl_context.verify_mode = ssl.CERT_NONE
client = OpenSearch(
    hosts = [{'host': host, 'port': port}],
    http_auth = auth,
    scheme="https",
    verify_certs=False,
    ssl_context=ssl_context,
)

async def create_index(index_name):
  # Create an index with non-default settings.
  #index_name = 'python-test-index'
  index_body = {
    'settings': {
      'index': {
        'number_of_shards': 4
      }
    }
  }
  response = client.indices.create(index_name, body=index_body)
  print('\nCreating index:')
  jsonPrint(response)


async def put_document(index_name,document,id):
  # Add a document to the index.
  response = client.index(
      index = index_name,
      body = document,
      id = id,
      refresh = True
  )
  print('\nAdding document:')
  jsonPrint(response)



async def query_document(index_name,query):
  # Search for the document.
  response = client.search(
      body = query,
      index = index_name
  )
  print('\nSearch results:')
  jsonPrint(response)


async def delete_doc(index_name,id):
  # Delete the document.
  response = client.delete(
      index = index_name,
      id = id
  )
  print('\nDeleting document:')
  jsonPrint(response)

async def delete_index(index_name):
  # Delete the index.
  response = client.indices.delete(
      index = index_name
  )
  print('\nDeleting index:')
  jsonPrint(response)

index_metric = "juzibot-sales-metric";
response_time = 60*1000
all_sales = ['童子铨','曾璐','陈子曦','董森','冯伦','韩祥宇','宋宗强','王建超']
juzi_corp_name = "北京句子互动科技有限公司"

async def myfunc():
  value = await client.get(
    id=2,
    index=index_metric
  )
  print(value)

asyncio.run()