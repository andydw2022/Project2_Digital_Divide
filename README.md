# Project2_Digital_Divide

Best to view this file in edit mode to see the layout better

Project Name : The Great Digital Divide

This project will examine the digital divide which refers to the gap between demographics and countries that have access to the internet

Project Team :  Andy de Wind

Purpose of the project: Extract , Transform/Cleanse,  Load (ETL)  and Visualise data in order to answer the following questions:

    1. List of countries ranked by internet speed. Who are the leaders?
    2. Use scatter plots to explore the demographics listed below with a country's intenet speed rank and if there 
       is any correlations 
        -Income per person
        -Internet user rate
        -Urban rate of population
    3. USe bar charts to compare a country's the same countries 
        - Speed Rank
        - Upload Speed MBPS
        - Download Speed MBPS
        - Income per person
        - Internet Usage rate
    
Method:
      1. Collect datasets that will help in answering the above questions by web scraping and download csv files from various sites :

        -https://www.fastmetrics.com/internet-connection-speed-by-country.php#median-internet-speeds-2020
        -https://www.dnb.com/content/dam/english/dnb-solutions/sales-and-marketing/iso_3digit_alpha_country_codes.csv
        -https://www.worldometers.info/world-population/population-by-country/
        -https://www.kaggle.com/datasets/sansuthi/gapminder-internet?resource=download?gap_minder.csv
            csv data collected :
            country        : Full name of country	
            incomeperperson: Gross Domestic Product per capita in constant 2000 US$. 
                             The inflation but not the differences in the cost of living 
                             between countries has been taken into account.
            internetuserate: Internet users (per 100 people). 
                             Internet users are people with access to the worldwide network.
            urbanrate:       Urban population (% of total) Urban population refers to people 
                             living in urban areas as defined by national statistical offices 
                             (calculated using World Bank population estimates and urban ratios 
                            from the United Nations World Urbanization Prospects)

      2. Load downloaded csv files into a PostGres database. 
      3. Clean and Transform the loaded data into separate tables using SQL and export into csv format
      4. Run flask app to scrape some data, store it in a Mongo database and display as is. Use links on the main web page 
         to navigate to other web pages to visualise the cleansed and tranformed data.
         -World Map of Countries color-coded by internet speed
         -Scatter plot of demographic data for correlation
         -Bar charts of demographic for comparison


To run Project Code:

    From Visual Studio : run app.py, Copy Flask API : http://127.0.0.1:5000/ and paste into a browser.
