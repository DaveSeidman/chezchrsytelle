import React from 'react';
import './index.scss';

function Values(props) {
  const { modal, setModal } = props;
  return (
    <div className="modal values" id="values">
      <div className="content">
        <h1>At Chez Chrsystelle, we value and believe in...</h1>
        <h3>Family Dinner </h3>
        <p>In this city and during these times it’s very easy to get into the habit of having dinner after the kids go to bed, in between loads of laundry, or sometimes not at all. Family Dinner is <b>important!</b></p>
        <p>We understand it’s not always perfect… the preteen is super picky about everything, the baby is poking the toddler with their fork, it’s chaos. But the bonds created by sharing a meal are just as important as the nutrition the food provides our bodies.</p>
        <p>We celebrate and reward families that make the time to enjoy our food together by offering a free meal in exchange for every family meal photos they send us. And it doesn’t even need to be a photo of them enjoying our food, we just want to see your happy faces all together!</p>
        <h3>Community</h3>
        <p>We build community one day at a time through actions big and small. Something as simple as taking an extra minute to learn your neighbor’s name or help them carry groceries makes us all stronger.</p>
        <p>Our favorite time of the week is Tuesdays at 5:30pm when we get to greet our friends and neighbors in front of our home and share a snack, a hug, a laugh, and a drink with the members of our community that have supported us since the beginning.</p>
        <p>We also support the local PTAs by donating $2 for every Magic Kale Salad that we sell to our excellent teachers. They are working hard to keep programs like the Arts, Music, and Sports accessible to our children and they deserve our support!</p>
        <h3>Service</h3>
        <p>We recognize that we’ve been lucky enough to have opportunities that others in our community have not. It’s our duty to help those that need it so we seek out those opportunities. If you know of an institution or individual in need, please use our contact page to tell us about them.</p>
        <h3>Sustainability</h3>
        <p>The ingredients for the yummy dinners you all enjoy come from many different places including our backyard garden and even all the way from Cameroon! We care about the planet and do as much as possible to protect it. All of our packaging materials are either 100% recyclable or made from recycled materials. Did you know the tops of our Salad containers are made from plants? And some of our sides come wrapped in organic banana leaves which actually preserve the food longer and biodegrades faster than paper.</p>
        <h3>Cultural Exchange</h3>
        <p>We know you won’t love everything on the menu that you try but we’re just happy you try them! We travel with our bellies and love tasting food from all over the world. My food is flavorful, and sometimes too spicy for some. If you ever try something you don’t like, please dump it in your organic recycling and we’ll give you a different meal next time, our treat! </p>
      </div>
      <button type="button" className="close" onClick={() => { setModal(null); }}>×</button>
    </div>

  );
}

export default Values;
