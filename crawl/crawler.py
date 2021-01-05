# import selenium 
from selenium import webdriver   # for webdriver
from selenium.webdriver.support.ui import WebDriverWait  # for implicit and explict waits
from selenium.webdriver.chrome.options import Options  # for suppressing the browser
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException

# xử lý dữ liệu
import csv
import pandas as pd
import json
import time 
import re
from tqdm import tqdm
import sys
import os

PATH = 'chromedriver.exe'
option = webdriver.ChromeOptions()
option.add_argument('headless')
driver = webdriver.Chrome(PATH)
# sign in
def sign_in(driver):
    driver.get('https://itviec.com/')
    driver.find_element_by_css_selector("a[data-toggle='modal']").click()
    time.sleep(2) # thời gian chờ popup form đăng nhập

    user = driver.find_elements_by_css_selector(".form-group-sign-in")[1]    
    password = driver.find_elements_by_css_selector(".form-group-sign-in")[2]

    # điền thông tin user 
    action_user = ActionChains(driver)
    action_user.move_to_element(user).click().send_keys("lethanhhm1@gmail.com").perform()
    time.sleep(2)

    # điền thông tin passowrd
    time.sleep(2)
    action_pass = ActionChains(driver)
    action_pass.move_to_element(password).click().send_keys("lethanh1999").perform()

    driver.find_element_by_css_selector(".button-red.space.ibutton.x-large").click()
    

# function lấy dữ liệu từ 1 link cho trước 
def get_data_from_link(link,driver=driver):
    driver.get(link)
    data_dict = {}
    data_dict['job_title'] = driver.find_element_by_css_selector('.job-details__title').text
    try:
        data_dict['description'] = driver.find_elements_by_css_selector('.job-details__paragraph')[0].text
    except:NoSuchElementException
    
    try :
        data_dict['experience'] =  driver.find_elements_by_css_selector('.job-details__paragraph')[1].text
    except: NoSuchElementException
    try:
        data_dict['culture_description'] =  driver.find_elements_by_css_selector('.job-details__paragraph')[2].text
    except: NoSuchElementException
    try:
        data_dict['salary'] = driver.find_element_by_css_selector('.salary-text').text
    except: NoSuchElementException
    try:
        data_dict['address'] = "\n".join([add.text for add in driver.find_elements_by_css_selector('.address__full-address')])
    except: NoSuchElementException
    try:
        data_dict['working_date'] = driver.find_element_by_css_selector('.working-date').text
    except: NoSuchElementException
    try:
        data_dict['jd_photos']  = "\n".join([photo.get_attribute('style')[23:-3] for photo in  driver.find_elements_by_css_selector('.jd-photos') ])
    except: NoSuchElementException
    return data_dict


def crawl_links(option) :
    links = []
    page = 1
    finish = False
    time.sleep(0.5)
    while not finish:
        url = f'https://itviec.com/it-jobs?page={page}&source=search_job'
        print(url)
        driver.get(url)
        jobs = [ job.find_element_by_css_selector('a').get_attribute('href') for job in driver.find_element_by_css_selector('.first-group').find_elements_by_css_selector('.title')]
        if len(jobs):
            links.extend(jobs)
        else:
            finish = True        
        
        if (option =='lastest') & (len(links) >= 100):
            finish = True

        page += 1  
    return links
    
        



if __name__ == "__main__":    

    
    
    sign_in(driver)

    links = crawl_links(sys.argv[1][1:])

    with open('links.txt','w') as f:
        f.writelines([link+'\n' for link in links])

    par = tqdm(links,total=len(links))
    for link in par :    
        data = get_data_from_link(link)        
        with open('data.json', 'a+') as f:
            json.dump(data, f)
            f.write('\n')
    df = pd.read_json('data.json',lines=True)   
    df.to_csv('data.csv',index=False) 
    driver.close()

