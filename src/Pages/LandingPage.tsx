import React, { FC, useContext, useEffect } from 'react';
import { Row, Typography } from 'antd';
import { AppContext } from '../Context/AppContext';
import styles from './LandingPage.module.scss';
import { Redirect } from 'react-router-dom';
import { currencyFormat, monthDifference } from '../utils';
import moment from 'moment';

const { Text, Title } = Typography;

const LandingPage: FC<any> = () => {
  const { dispatch, state: { showHeader, showLayout, showSidebar, auth, user}} = useContext(AppContext);
  useEffect(() => {
    if(dispatch && (!showSidebar || !showHeader || !showLayout )) {
      dispatch({
        showSidebar: true,
        showHeader: true,
        showLayout: true,
      })
    }
  }, [dispatch, showHeader, showLayout, showSidebar]);

  const head = document.getElementById('head');

  const headHeight = (head && head.offsetHeight) || 0;
  const maxHeight = `calc(100vh - ${headHeight + 148}px)`;

  if (!auth.isLoggedIn) {
    return <Redirect to="/login" />
  }

  const difference = monthDifference(moment(user.firstContributionDate), moment());
  const monthly = Array(difference).fill({}).map((each: any, index) => {
    const month = moment(user.firstContributionDate).add(index, 'month').format('MMMM YYYY');
    return { month, amount: currencyFormat(+user.monthlyContribution || 0)}
  });
  const total = difference * parseInt(user.monthlyContribution,10) || 0;

  return <div className={styles.contributions}>
    <Row id="head" className={styles.head}>
    <Row className={styles.flex}>
      <Title ellipsis level={4}>Total Contributions</Title>
      <Title ellipsis style={{ color: 'limegreen', minWidth: 140, textAlign: 'right'}} level={4}>
        {currencyFormat(total || 0)}
      </Title>
    </Row>
    <Row className={styles.flex}>
      <Title ellipsis level={4}>Outstanding Loan</Title>
      <Title ellipsis style={{ color: 'red', minWidth: 140, textAlign: 'right'}} level={4}>KSH. 0.00</Title>
    </Row>
    </Row>
    <Row style={{ display: 'flex', justifyContent: 'center'}}>
      <Text style={{ fontSize: 16, lineHeight: '18px'}} strong>My Contributions Breakdown</Text>
    </Row>
    <div style={{maxHeight, minHeight: 200 }} className={styles.table}>
      {
        monthly.reverse().map((cont: any, index: number) => {
          return (
            <div
              className={styles.single}
              key={index} style={{ width: '100%', display: 'flex', justifyContent: 'space-between'}}>
            <div>
            {cont.month}
          </div>
              <div>
                {cont.amount}
              </div>
            </div>
          )
        })
      }
    </div>
  </div>
}

export default LandingPage;

