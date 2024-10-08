import "./Contatti.css";

function Contatti() {
    return (
        <div className="container mx-auto py-8">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-semibold">Il Terzetto</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
                <div className="single_advisor_profile wow fadeInUp" data-wow-delay="0.2s"
                     style={{visibility: 'visible', animationDelay: '0.2s', animationName: 'fadeInUp'}}>
                    {/* Team Thumb */}
                    <div className="advisor_thumb">
                        <img src="Lorenzo1.jpg" alt="Lorenzo Calabrese"/>
                    </div>
                    {/* Team Details */}
                    <div className="single_advisor_details_info">
                        <div className="flex items-center justify-between">
                            <h6>Lorenzo Calabrese</h6>
                            <p className="email">
                                <a href="mailto:l.calabrese28@studenti.uniba.it" className="email-link">l.calabrese28@studenti.uniba.it</a>
                            </p>
                        </div>
                        <p className="designation">Frontend</p>
                    </div>
                </div>
                {/* Single Advisor */}
                <div className="single_advisor_profile wow fadeInUp" data-wow-delay="0.3s"
                     style={{visibility: 'visible', animationDelay: '0.3s', animationName: 'fadeInUp'}}>
                    {/* Team Thumb */}
                    <div className="advisor_thumb">
                        <img src="Kekko1.jpg" alt="Francesco Conforti"/>
                    </div>
                    {/* Team Details */}
                    <div className="single_advisor_details_info">
                        <div className="flex items-center justify-between">
                            <h6>Francesco Conforti</h6>
                            <p className="email">
                                <a href="mailto:f.conforti09@studenti.uniba.it" className="email-link">f.conforti09@studenti.uniba.it</a>
                            </p>
                        </div>
                        <p className="designation">Backend</p>
                    </div>
                </div>
                {/* Single Advisor */}
                <div className="single_advisor_profile wow fadeInUp" data-wow-delay="0.4s"
                     style={{visibility: 'visible', animationDelay: '0.4s', animationName: 'fadeInUp'}}>
                    {/* Team Thumb */}
                    <div className="advisor_thumb">
                        <img src="Peppe.jpeg" alt="Giuseppe Pio De Biase"/>
                    </div>
                    {/* Team Details */}
                    <div className="single_advisor_details_info">
                        <div className="flex items-center justify-between">
                            <h6>Giuseppe Pio De Biase</h6>
                            <p className="email">
                                <a href="mailto:g.debiase5@studenti.uniba.it" className="email-link">g.debiase5@studenti.uniba.it</a>
                            </p>
                        </div>
                        <p className="designation">Frontend</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Contatti;
