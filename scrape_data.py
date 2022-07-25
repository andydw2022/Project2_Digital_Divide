from splinter import Browser
from bs4 import BeautifulSoup as bs
import time
from webdriver_manager.chrome import ChromeDriverManager
import requests
import pymongo
import pandas as pd



def scrape_info():
    # Initialize PyMongo to work with MongoDBs
    conn = 'mongodb://localhost:27017'
    client = pymongo.MongoClient(conn)

    # Define database and collection
    db = client.internetspeeds
    collection = db.countryspeed

    # Scrape page into Soup
    # Visit Fastmetrics webpage to get web site title and table data
    url = "https://www.fastmetrics.com/internet-connection-speed-by-country.php#median-internet-speeds-2020"
    time.sleep(1)

    # Retrieve page with the requests module
    response = requests.get(url)
    # Create BeautifulSoup object; parse with 'lxml'
    soup = bs(response.text, 'lxml')
    soup
    # Examine the results, then determine element that contains sought info
    webpage_title = soup.find_all("title")[0].text

    # Visit Fastmetrics webpage to get table data
    url = "https://www.fastmetrics.com/internet-connection-speed-by-country.php#median-internet-speeds-2020"
    time.sleep(1)

    # Scrape page into Soup
    tables = pd.read_html(url)
    df = tables[0]
    df.head()
    df.set_index("Rank")
    df.reset_index(drop=True, inplace=True)
    df.to_csv('countryinternetspeedstable.csv')
    countryinternetspeedstable = df.to_html(classes='table table-striped',index=False)  
    df.to_html('countryinternetspeedstable.html')
    countryinternetspeedstable.replace('\n', '')
    df.to_html()
    speed_data = {
        "Title": webpage_title,
        "speed_table": countryinternetspeedstable
        }
           
    #Insert scraped data into MongoDB    
    collection.insert_one(speed_data)




