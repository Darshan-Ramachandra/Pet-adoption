import React, { useContext, useEffect, useState } from 'react';
import AdoptionReqCard from './AdoptionReqCard';
import { AuthContext } from '../../../components/providers/AuthProvider';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import emailjs from '@emailjs/browser';

const AdoptionReq = () => {
  const [pets, setPets] = useState([]);
  const { user } = useContext(AuthContext);
  const [filteredCard, setFilteredCard] = useState([]);
  const [allCamps, setAllCamps] = useState([])

  const axiosSecure = useAxiosSecure();

  // Initialize EmailJS when component mounts
  useEffect(() => {
    try {
      if (typeof emailjs !== 'undefined') {
        emailjs.init('bn6q_x-9Ja771waI1', {
          useGlobal: true,
          debug: true
        });
        console.log('EmailJS initialized successfully');
      } else {
        console.error('EmailJS is not loaded');
      }
    } catch (error) {
      console.error('Error initializing EmailJS:', error);
    }
  }, []);

  // Email sending function using EmailJS
  const sendEmail = async (to, templateId, templateParams) => {
    try {
      console.log('Attempting to send email with params:', { to, templateId, templateParams });
      
      // Add recipient email to template params
      const paramsWithRecipient = {
        ...templateParams,
        to_email: to,
        user_email: to,
        email: to
      };
      
      console.log('Final template params:', paramsWithRecipient);
      
      // Make sure EmailJS is initialized
      emailjs.init('bn6q_x-9Ja771waI1');
      
      const response = await emailjs.send(
        'service_k3ug4b6',
        templateId,
        paramsWithRecipient,
        'bn6q_x-9Ja771waI1'
      );

      console.log('Email sent successfully:', response);
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      console.error('Error details:', {
        message: error.message,
        text: error.text,
        status: error.status
      });
      return false;
    }
  };

  // Email sending function for acceptance
  const sendAcceptanceEmail = async (pet) => {
    console.log('Sending acceptance email for pet:', pet);
    
    const templateParams = {
      userName: pet.userName,
      user_name: pet.userName,
      petName: pet.name,
      pet_name: pet.name,
      ownerEmail: pet.ownerEmail,
      owner_email: pet.ownerEmail,
      message: `Your adoption request for ${pet.name} has been accepted! Please contact the owner at ${pet.ownerEmail} to arrange the adoption process.`
    };

    console.log('Acceptance template params:', templateParams);

    return await sendEmail(
      pet.userEmail,
      'template_ql8d57d',
      templateParams
    );
  };

  // Email sending function for rejection
  const sendRejectionEmail = async (pet) => {
    console.log('Sending rejection email for pet:', pet);
    
    const templateParams = {
      userName: pet.userName,
      user_name: pet.userName,
      petName: pet.name,
      pet_name: pet.name,
      message: `We regret to inform you that your adoption request for ${pet.name} has been declined by the pet owner. We encourage you to continue looking for other pets available for adoption on our platform.`
    };

    console.log('Rejection template params:', templateParams);

    return await sendEmail(
      pet.userEmail,
      'template_kjnyiyd',
      templateParams
    );
  };

  useEffect(() => {
    const baseUrl = "http://localhost:5007";
    fetch(`${baseUrl}/addtoadopt`)
      .then(response => response.json())
      .then(data => {
        console.log('Fetched pets:', data);
        setPets(data);
      })
      .catch(error => console.error("Error fetching adoption request pets:", error));
  }, []);

  useEffect(() => {
    if (user && user.email) {
      setFilteredCard(pets.filter(pet => pet.ownerEmail === user.email && pet.adopt_Req===true))
    }
  }, [pets, user]);

  console.log('request pet',pets);
  
  const updatePetStatusLocally = (petId, newStatus) => {
    setAllCamps((prevPets) =>
      prevPets.map((pet) =>
        pet._id === petId ? { ...pet, adopted: newStatus } : pet
      )
    );
  };
  
  const handleAccept = (pet) => {
    const petId = pet._id;

    // Optimistically update the local state
    updatePetStatusLocally(petId, true);

    axiosSecure
      .patch(`/admin/accept/${petId}`,{petId:pet.petId,id:pet._id})
      .then(async (res) => {
        console.log(res.data);
        if (res.data.modifiedCount === 0) {
          // Revert the local state if the request fails
          updatePetStatusLocally(petId,false);
          console.error('Failed to update adoption status.');
        } else {
          // Send email notification
          const emailSent = await sendAcceptanceEmail(pet);

          if (emailSent) {
            console.log('Acceptance email sent successfully');
          } else {
            console.log('Failed to send acceptance email');
          }

          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Accept Adoption Request successfully',
            showConfirmButton: false,
            timer: 1500,
          });
        }
      })
      .catch((error) => {
        // Revert the local state if the request fails
        updatePetStatusLocally(petId, false);
        console.error('Error updating pause status:', error);
      });
  };

  const handleReject = (pet) => {
    const petId = pet._id;

    // Optimistically update the local state
    updatePetStatusLocally(petId, false);

    axiosSecure
      .patch(`/admin/reject/${petId}`,{petId:pet.petId,id:pet._id})
      .then(async (res) => {
        console.log(res.data);
        if (res.data.modifiedCount === 0) {
          // Revert the local state if the request fails
          updatePetStatusLocally(petId, true);
          console.error('Failed to update pause status.');
        } else {
          // Send email notification
          const emailSent = await sendRejectionEmail(pet);

          if (emailSent) {
            console.log('Rejection email sent successfully');
          } else {
            console.log('Failed to send rejection email');
          }

          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'You Have Reject Donation Request successfully',
            showConfirmButton: false,
            timer: 1500,
          });
        }
      })
      .catch((error) => {
        // Revert the local state if the request fails
        updatePetStatusLocally(petId, true);
        console.error('Error updating adoption status:', error);
      });
  };

  return (
    <div>
      {filteredCard.length === 0 ? (
        <p className='text-center text-bold text-2xl flex items-center justify-center h-[80vh]'>No adoption requests found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table">
            {/* head */}
            <thead>
              <tr>
                <th>Requested By</th>
                <th>Phone</th>
                <th>Email</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredCard.map((card) => (
                <tr key={card.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="font-bold">{card.userName}</div>
                        <div className="text-sm opacity-50">{card.userAddress}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <p>{card.phone}</p>
                  </td>
                  <td>{card.userEmail}</td>
                  <th>
                    <button onClick={() => handleAccept(card)} className="btn btn-warning btn-xs">Accept</button>
                    <button onClick={() => handleReject(card)} className="btn btn-warning btn-xs">Reject</button>
                  </th>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdoptionReq;
