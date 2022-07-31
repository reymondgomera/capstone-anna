import Anna1 from '../../assets/Anna_1.svg';
import Anna2 from '../../assets/Anna_2.svg';

const AboutPage = () => {
   return (
      <div className='d-flex h-100'>
         <div className='w-100 p-5'>
            <div className='d-flex flex-column align-items-center'>
               <h1 className='custom-heading my-5'>ABOUT</h1>
               <img className='anna-img my-3 d-block d-lg-none' src={Anna1} alt='Anna' />
            </div>
            <div>
               <h5 className='text-primary fw-bold'>Anna</h5>
               <p>
                  This is Anna, a career recommender chatbot. Anna helps you, a senior high school student who is looking for recommendations on what
                  degree programs to take on college by getting your interest and sharing you information about existing degree programs out there.
                  Anna will help you with your queries and feel free to ask Anna for recommendation, she will be very pleased to meeting you.
               </p>
            </div>
            <div>
               <h5 className='text-primary fw-bold'>
                  Research Study
                  <span className='mx-1' style={{ fontFamily: 'sans-serif' }}>
                     &amp;
                  </span>
                  Problem
               </h5>
               <p>
                  Shifting and dropout is one of the prevalent problems faced by college students especially to those who are within the generation Z.
               </p>
            </div>
         </div>
         <div className='d-none d-lg-flex bg-primary justify-content-center align-items-center px-5'>
            <img className='anna-img m-5' src={Anna2} alt='Anna' />
         </div>
      </div>
   );
};

export default AboutPage;
