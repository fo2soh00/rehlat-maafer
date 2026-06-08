import { BLOG_CONFIG } from '@/lib/config'

export default function About() {
  return (
    <div className="wrap">
      <p className="page-kicker">عن الكاتب</p>
      <h1 className="page-title">عني</h1>
      <div className="title-rule" />

      <div className="about">
        <div className="portrait">
          <div className="frame">
            <div className="photo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/moustafa-portrait.jpg" alt={BLOG_CONFIG.siteTitle} />
            </div>
            <p className="cap">{BLOG_CONFIG.siteTitle}</p>
          </div>
        </div>

        <div className="bio-long">
          <p>أنا مصطفى فؤاد. مصري، عايش في الرياض. بديت صيدلي، بس اخترت طريق تاني — إني أبني.</p>
          <p>من سنة ٢٠٢٣ وأنا ببني ستارت أب من الصفر. مش بحكي هنا عن الشركة — بحكي عن الشخص اللي بيعدّي الرحلة دي. عني أنا.</p>
          <p>الرحلة فيها أيام بتتكسر فيها كل حاجة، وقرارات مفيش فيها إجابة صح. بس فيها كمان لحظات بتفكّرك ليه بدأت — انتصار صغير، فكرة نجحت، أو يوم تحس فيه إن اللي بتعمله ليه معنى.</p>
          <p>بكتب عن الاتنين: <strong>الصعب والحلو</strong>. مش عن النجاح بس، ولا عن الألم بس — عن الرحلة كاملة وهي لسه بتحصل.</p>
          <p>بكتب للناس اللي بتبني. لو إنت منهم — أهلاً بيك في رحلة معافر.</p>

          <div className="contact">
            <p className="lbl">تواصل معايا</p>
            <div className="links">
              <a href={BLOG_CONFIG.linkedin} target="_blank" rel="noopener noreferrer">لينكدإن ↗</a>
              <a href={BLOG_CONFIG.whatsapp} target="_blank" rel="noopener noreferrer">واتساب ↗</a>
              <a href={`mailto:${BLOG_CONFIG.email}`}>إيميل ↗</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
