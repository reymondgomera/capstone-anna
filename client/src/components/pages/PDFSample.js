import React from 'react';
import { Page, Text, View, Document, StyleSheet, PDFViewer, Font, PDFDownloadLink } from '@react-pdf/renderer';

import GTWalsheimProRegular from '../../fonts/GTWalsheimPro-Regular.ttf';
import GTWalsheimProBold from '../../fonts/GTWalsheimPro-Bold.ttf';

const styles = StyleSheet.create({
   body: {
      paddingVertical: 50,
      paddingHorizontal: 40,
      width: '100%',
      height: '100%',
      fontFamily: 'GTWalsheimProRegular',
      fontSize: 12,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
   },
   viewer: {
      width: '100%',
      height: '100vh',
   },
   basicInfo: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 18,
      flexWrap: 'wrap',
   },
   basicInfoContent: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      paddingRight: 16,
   },
   fontBold: {
      fontFamily: 'GTWalsheimProBold',
      fontSize: 13,
   },
   headingTitle: {
      fontFamily: 'GTWalsheimProBold',
      fontSize: 18,
      marginBottom: 15,
   },
   riasecCode: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 18,
      fontSize: 13.5,
      flexWrap: 'wrap',
   },
   riasecCodeContent: {
      color: '#FFFFFF',
      backgroundColor: '#e7b22b',
      padding: 16,
      marginRight: 8,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 8,
   },
   riasecCodeTitle: {
      fontFamily: 'GTWalsheimProBold',
      marginBottom: 8,
   },
   mb1: {
      marginBottom: 8,
   },
   mb2: {
      marginBottom: 16,
   },
   recommendations: {
      backgroundColor: '#f1f1f1',
      marginBottom: 15,
      padding: 16,
      borderRadius: 8,
   },
   item: {
      display: 'flex',
      flexDirection: 'row',
      marginBottom: 4,
   },
   bulletPoint: {
      width: 10,
      fontSize: 10,
   },
   itemContent: {
      flexGrow: 1,
   },
});

Font.register({
   family: 'GTWalsheimProRegular',
   src: GTWalsheimProRegular,
});

Font.register({
   family: 'GTWalsheimProBold',
   src: GTWalsheimProBold,
});

const riasecCode = [
   ['convetional', 6],
   ['social', 4],
   ['realistic', 3],
];

const riasecCourses = [
   'AB in Economics',
   'BS in Accountancy',
   'BS in Accounting Technology',
   'BS in Customs Administration',
   'BS in Data Science',
   'BS in Finance',
   'BS in Management Accounting',
   'BS in Office Administration',
   'BSBA in Banking and Finance',
   'BSBA in Business Economics',
   'BSBA in Financial Management',
   'Bachelor of Library and Information Science',
];
const strandCourses = [
   'AB in Economics',
   'BS in Accountancy',
   'BS in Accounting Technology',
   'BS in Agribusiness',
   'BS in Agribusiness Economics',
   'BS in Aviation Management',
   'BS in Business Administration',
   'BS in Customs Administration',
   'BS in Entrepreneurial Management',
   'BS in Entrepreneurship',
   'BS in Finance',
   'BS in Hospitality Management',
   'BS in Hotel and Restaurant Management',
   'BS in International Hospitality Management',
   'BS in Legal Management',
   'BS in Management Accounting',
   'BS in Marketing',
   'BS in Office Administration',
   'BS in Real Estate Management',
   'BS in Tourism',
   'BS in Tourism Management',
   'BS in Travel Management',
   'BSBA in Banking and Finance',
   'BSBA in Business Economics',
   'BSBA in Entrepreneurship',
   'BSBA in Financial Management',
   'BSBA in Human Resource Development Management',
   'BSBA in Management',
   'BSBA in Management Accounting',
   'BSBA in Marketing Management',
   'BSBA in Operations Management',
];

const List = ({ children }) => {
   return <View style={styles.recommendations}>{children}</View>;
};

const Item = ({ children }) => {
   return (
      <View style={styles.item}>
         <Text style={styles.bulletPoint}>•</Text>
         <Text style={styles.itemContent}>{children}</Text>
      </View>
   );
};

const PDFSample = () => {
   return (
      <div className='h-100'>
         <PDFViewer style={styles.viewer}>
            <Document>
               <Page style={styles.body}>
                  <View>
                     <Text style={{ marginLeft: 'auto', marginBottom: 4, fontSize: 10 }}>10/15/2022</Text>
                     <Text style={styles.headingTitle}>Basic Information: </Text>
                     <View style={styles.basicInfo}>
                        <View style={styles.basicInfoContent}>
                           <Text style={styles.mb1}>Student Name</Text>
                           <Text style={styles.fontBold}>Irika Salas Mabini</Text>
                        </View>
                        <View style={styles.basicInfoContent}>
                           <Text style={styles.mb1}>Age</Text>
                           <Text style={styles.fontBold}>24</Text>
                        </View>
                        <View style={styles.basicInfoContent}>
                           <Text style={styles.mb1}>Sex</Text>
                           <Text style={styles.fontBold}>Female</Text>
                        </View>
                        <View style={styles.basicInfoContent}>
                           <Text style={styles.mb1}>Strand</Text>
                           <Text style={styles.fontBold}>ABM</Text>
                        </View>
                     </View>
                     <Text style={styles.headingTitle}>RIASEC Code: </Text>
                     <View style={styles.riasecCode}>
                        {riasecCode[0][1] && riasecCode.length > 0 ? (
                           riasecCode.map(
                              (code, i) =>
                                 code[1] && (
                                    <View key={i} style={styles.riasecCodeContent}>
                                       <Text style={styles.riasecCodeTitle}>{code[0].toUpperCase()}</Text>
                                       <Text style={{ fontFamily: 'GTWalsheimProBold', fontSize: 16 }}>{code[1]}</Text>
                                    </View>
                                 )
                           )
                        ) : (
                           <View style={styles.riasecCodeContent}>
                              <Text style={styles.fontBold}>N/A</Text>
                           </View>
                        )}
                     </View>

                     <Text style={[styles.headingTitle, styles.mb2]}>Recommendation of Anna: </Text>
                     <Text style={styles.headingTitle}>RIASEC: </Text>
                     <List>
                        {riasecCourses && riasecCourses.length > 0 ? (
                           riasecCourses.map((course, i) => (
                              <Item key={i} style={styles.recommendations}>
                                 {course}
                              </Item>
                           ))
                        ) : (
                           <Text>N/A</Text>
                        )}
                     </List>

                     <Text style={styles.headingTitle}>Strand: </Text>
                     <List>
                        {strandCourses && strandCourses.length > 0 ? (
                           strandCourses.map((course, i) => (
                              <Item key={i} style={styles.recommendations}>
                                 {course}
                              </Item>
                           ))
                        ) : (
                           <Text>N/A</Text>
                        )}
                     </List>
                  </View>
               </Page>
            </Document>
         </PDFViewer>
      </div>
   );
};

export default PDFSample;
