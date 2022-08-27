const titleCase = str => {
   const strArray = str.split(' ');
   if (strArray.length > 0) {
      const titleCaseString = strArray.map(string => {
         return string.charAt(0).toUpperCase() + string.slice(1, string.length);
      });
      return titleCaseString.join(' ');
   } else return str.charAt(0).toUpperCase() + str.slice(1, str.length);
};

export { titleCase };
