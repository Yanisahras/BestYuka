import React, {useState, useContext, useEffect} from 'react';
import {
  View,
  Text,
  Container,
  Content,
  Header,
  ListItem,
  Left,
  Right,
  Button,
  Body,
} from 'native-base';
import {StyleSheet, ActivityIndicator} from 'react-native';
import {AppContext} from '../context/AppContext';
import Axios from 'axios';

const Historique = ({navigation, route}) => {
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);
  const {user} = useContext(AppContext);
  useEffect(() => {
    Axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
    Axios.post('/api/getHistorique')
      .then(response => {
        console.log(response.data.data);
        setLogs(response.data.data);
        setLoading(false);
      })
      .catch(error => {
        alert('Unexpected Error !');
        console.log('error from somewhere');
      });
  }, []);
  if (loading) {
    return (
      <View
        style={{
          display: 'flex',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  return (
    <Container>
      <Content>
        <Header style={styles.customheader}>
          <Text style={{color: 'white', fontSize: 22}}>Historique</Text>
        </Header>
        <Text style={{color: 'black', fontSize: 22}} />
        {logs.length === 0 ? (
          <Text>Vous n'avez pas encors pris un repas !</Text>
        ) : (
          logs.map(log => {
            return <HistoriqueItem repas={log.name} date={log.date} />;
          })
        )}
      </Content>
    </Container>
  );
};

const HistoriqueItem = ({repas, date}) => {
  return (
    <ListItem>
      <Left>
        <Text> {repas} </Text>
      </Left>
      <Body>
        <Text>{date}</Text>
      </Body>
    </ListItem>
  );
};

const styles = StyleSheet.create({
  customheader: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Historique;
