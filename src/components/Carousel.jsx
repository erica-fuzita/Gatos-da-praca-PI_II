import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import './Carousel.css';

export default function Carousel() {
  return (
    <div className="carousel-container">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop={true}
      >
        <SwiperSlide>
          <a href="#">
            <img src="/home/gato-malhado.jpg" alt="gato malhado" />
          </a>
        </SwiperSlide>

        <SwiperSlide>
          <a href="#">
            <img src="/banners/banner-2.jpg" alt="gato branco com orelhas pretas e olhos azuis" />
          </a>
        </SwiperSlide>

        <SwiperSlide>
          <a href="#">
            <img src="/banners/banner-3.jpg" alt="gato laranja" />
          </a>
        </SwiperSlide>
      </Swiper>
    </div>
  );
}
