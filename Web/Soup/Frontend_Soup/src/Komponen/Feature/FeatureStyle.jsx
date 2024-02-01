const FeatureStyle = () => {
  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      gap: '31px',
      marginTop: '100px',
      marginBottom: '100px',
      flexWrap: 'wrap',
    },
    box: {
      width: '100%', // Mengubah lebar ke 100% agar menyesuaikan lebar parent
      maxWidth: '324px', // Menambahkan maxWidth agar tidak terlalu melebar
      height: '207px', // Mengubah tinggi menjadi auto agar menyesuaikan konten
      padding: '16px',
      borderRadius: '20px',
      border: '1px solid #BDBDBD',
      gap: '31px',
      backgroundColor: '#FFFFFF',
      boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
      textAlign: 'center',
      transition: 'box-shadow 0.3s ease',
      marginBottom: '20px', // Menambahkan margin bawah agar ada ruang di antara box
    },
    title: {
      fontFamily: 'Montserrat Variable',
      fontStyle: 'normal',
      fontWeight: '600',
      fontSize: '32px',
      lineHeight: '40px',
      color: '#FABC1D',
      marginBottom: '10px',
    },
    description: {
      fontFamily: 'Montserrat Variable',
      fontStyle: 'normal',
      fontWeight: '500',
      fontSize: '16px',
      lineHeight: '20px',
      textAlign: 'center',
      color: '#000000',
      padding: '10px',
      borderRadius: '10px',
      margin: 'auto',
    },
  };

  return styles;
};

export default FeatureStyle;
