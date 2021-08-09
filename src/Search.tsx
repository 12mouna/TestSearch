import React, { useState, useCallback } from 'react';
// eslint-disable-next-line max-len
import { Input, Card, Avatar, Collapse, List, Tag, Empty, notification} from 'antd';
import { SearchOutlined } from  '@ant-design/icons';
import moment from 'moment'
import "./search.scss"
import 'antd/dist/antd.css';

// eslint-disable-next-line no-empty-pattern
const Search: React.FC<any> = ({}) =>{
  const [data, setData] = useState([])
  const [dataFetched,setDataFetched] = useState(false)
  const onClickSearch = useCallback((event) => {
    fetch(`https://api.joblocal.de/v4/search-jobs/?search.query=${event.target.value}`,
      {
        "method": "GET",
        "headers": {
          "accept": "application/json",
        }
      }).then(res => res.json())
      .then((data) => {
        setData(data.included);
        setDataFetched(true);
      },
      (error) => {
        setDataFetched(false);
        notification.open({
          message: 'failed to fetch results',
          description:error });
      });},[])
  return (
    <div data-testid='testsearch-1'>
      <Input placeholder="Search for a job" onPressEnter={(event:any) => {
        onClickSearch(event)
      }}
      className='textSearch'
      suffix={<SearchOutlined />}/>
      {dataFetched ? (
        (data !== undefined) && (data.map((item:any) => {
          const qualifications: any[] = []
          item.attributes.qualifications.map((item:any) => {
            qualifications.push(item.title)
          })
          return( 
            <div key='1' className='cardCentred'>
              <Card title={<h1>{item.attributes.title}</h1>}
                bordered={false}
                style={{ width: 300 }} 
                className='contentCard' key='1'
              >
                <Card.Meta
                  avatar={
                    <>
                      {item.attributes.company.logo && (
                        <Avatar src={item.attributes.company.logo}/>
                      )}
                      <Tag color="green">
                        {item.attributes.company.industry}
                      </Tag>
                    </> }
                  title={item.attributes.company.name}
                  description=
                    {item.attributes.publications && 
                        item.attributes.publications.map(
                          (publication:any) =>
                            moment(publication.createTime).fromNow())}       
                />
                {item.attributes.introduction && 
                (
                  <> 
                    <h5>Job description</h5>
                    <p>{item.attributes.introduction}</p>
                  </>
                )}
                <Collapse>
                  {item.attributes.responsibilities &&(
                    <>
                      <h5>Main responsabilities</h5>
                      <p>{item.attributes.responsibilities}</p>
                    </>
                  )}
                  {item.attributes.requirement && (
                    <>
                      <h5>Requirements</h5>
                      <p>{item.attributes.requirements}</p>
                    </>
                  )}
                  <Collapse.Panel header="Show more details" key="1">
                    {qualifications && (
                      <>
                        <h5>Qualifications</h5>
                        <List
                          size="small"
                          dataSource={qualifications}
                          renderItem={(item:any) => 
                            <List.Item>
                              {item}
                            </List.Item>}
                        />
                      </>
                    )}
                  </Collapse.Panel>
                </Collapse>
              </Card>  
            </div>      
          )               
        }      
        ))
      ): (<Empty />)}       
    </div>
  )
}
export default Search
