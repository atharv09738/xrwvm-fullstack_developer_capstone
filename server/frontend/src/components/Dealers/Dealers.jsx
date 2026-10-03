import React, { useState, useEffect } from 'react';
import "./Dealers.css";
import "../assets/style.css";
import Header from '../Header/Header';

const Dealers = () => {
  const [dealersList, setDealersList] = useState([]);
  const [states, setStates] = useState([]);

  const get_dealers = async () => {
    try {
      const res = await fetch("http://localhost:8000/djangoapp/dealerships", { method: "GET" });
      const retobj = await res.json();
      console.log("Dealers response:", retobj);
      let all_dealers = retobj.dealers || [];
      let states_arr = [];
      all_dealers.forEach((dealer) => {
        states_arr.push(dealer.state);
      });
      setStates(Array.from(new Set(states_arr)));
      setDealersList(all_dealers);
    } catch (error) {
      console.error("Failed to fetch dealers:", error);
    }
  };

  const filterDealers = async (state) => {
    if (state === "All") {
      get_dealers();
      return;
    }
    try {
      const res = await fetch("http://localhost:8000/djangoapp/dealerships/" + state, { method: "GET" });
      const retobj = await res.json();
      console.log("Filtered dealers:", retobj);
      setDealersList(retobj.dealers || []);
    } catch (error) {
      console.error("Failed to filter dealers:", error);
    }
  };

  useEffect(() => {
    get_dealers();
  }, []);

  let isLoggedIn = sessionStorage.getItem("username") != null;

  return (
    <div>
      <Header />
      <table className='table'>
        <thead>
          <tr>
            <th>ID</th>
            <th>Dealer Name</th>
            <th>City</th>
            <th>Address</th>
            <th>Zip</th>
            <th>
              <select name="state" id="state" onChange={(e) => filterDealers(e.target.value)}>
                <option value="" selected disabled hidden>State</option>
                <option value="All">All States</option>
                {states.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </th>
            <th>Review</th>
          </tr>
        </thead>
        <tbody>
          {dealersList.map(dealer => (
            <tr key={dealer.id}>
              <td>{dealer['id']}</td>
              <td><a href={'/dealer/' + dealer['id']}>{dealer['full_name']}</a></td>
              <td>{dealer['city']}</td>
              <td>{dealer['address']}</td>
              <td>{dealer['zip']}</td>
              <td>{dealer['state']}</td>
              <td><a href={`/postreview/${dealer['id']}`} style={{color:"blue"}}>Write Review</a></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dealers;