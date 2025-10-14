import Navbar from "../components/navbar";
import Footer from "../components/footer";
import image1 from "../assets/image1.jpeg";
import image2 from "../assets/image2.jpeg";
import image3 from "../assets/image3.jpeg";
import image4 from "../assets/image4.jpeg";
import AboutUs from "../components/about_us";
const Home = () => {
  return (
    <div className="home-container">
      {/* Vision Section */}

      <div className="section">
        <h2>Our Vision</h2>
        <p>
        <i>To see an enlightened free society that is socially, economically, and politically empowered.

Let me know if you need any modifications or formatting adjustments! 🚀     </i>   </p>
        <div className="image-container">
          <img src={image1} alt="Vision 1" className="circle" />

        </div>
      </div>

      {/* Mission Section */}
      <div className="section">
        <h2>Our Mission</h2>
        <p>
          <i>
        To advocate for Reproductive Health, the Rights of Youths and Women in the community that will work towards a holistic empowerment of the community through socio-economic and political initiatives.

Let me know if you need any formatting adjustments or edits! 🚀    </i>    </p>
        <div className="image-container">
          <img src={image2} alt="Mission 1" className="shaped" />
          <img src={image3} alt="Mission 2" className="circle" />
        </div>
      </div>

      {/* Objectives Section */}
      <div className="section">
        <h2>Our Objectives</h2>
        <ul class="objectives-list">
          <li>✔ Influence policy-making and educate community members about the rights of youths and women.</li>
          <li>✔ Educate women, children, and youths about their rights as provided in the Constitution of Kenya and the Universal Declaration of Human Rights (UDHR).</li>
          <li>✔ Promotion of education among children living under abject poverty through sponsorship of programs in schools.</li>
          <li>✔ Promote hygiene to help fight preventable diseases like diarrhoea, typhoid, cholera, and malaria, which claim the lives of many children every year.</li>
          <li>✔ Provide forums for members to share experiences and resources to promote collaborative and networking efforts.</li>
          <li>✔ Support orphans and vulnerable children in the community.</li> 
          <li>✔ Equipping women and youths with skills like handicrafts, preparation of detergents like multi-purpose liquid and bar soaps.</li>
        </ul>
        <div className="image-container">

          <img src={image4} alt="Objective 2" className="shaped" />
        </div>
      </div>

      {/* About Us Section */}
      <AboutUs />

    </div>
  );
};

export default Home;
