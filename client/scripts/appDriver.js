const trucksUrl = 'http://localhost:8080/api/trucks';

async function getTrucks() {
    try {
        const response = await fetch(trucksUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('jwt_token')}`
            }
        });
        const trucks = await response.json();
        if (trucks.message) {
            alert(trucks.message);
        }
        if (trucks.trucks) {
            const truckList = document.createElement('div');
            truckList.classList.add('truck-list');
            const main = document.getElementsByTagName('main').item(0);
            main.appendChild(truckList);
            trucks.trucks.forEach(truck => truckList.appendChild(addTruckToPage(truck)));
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function addTruckToPage(truck) {
    const propertiesToShow = ['type', 'status', 'assigned_to'];
    if (truck) {
        const truckContainer = document.createElement('div');
        truckContainer.classList.add('truck');
        truckContainer.id = truck._id;
        propertiesToShow.forEach(key => {
            const div = document.createElement('div');
            div.classList.add(key);

            const dataName = document.createElement('p');
            dataName.classList.add('data-name');
            const dataNameValue = key.split('-').join(' ');
            dataName.innerText = dataNameValue.charAt(0).toUpperCase() + dataNameValue.slice(1);
            div.appendChild(dataName);

            const data = document.createElement('p');
            data.classList.add('data');
            if(truck[key] === null) {
                data.innerText = 'null';
            } else {
                data.innerText = truck[key];
            }
            div.appendChild(data);

            truckContainer.appendChild(div);
        });
        const divBtns = document.createElement('div');
        divBtns.classList.add('truck-buttons');
        
        const infoBtn = document.createElement('button');
        infoBtn.classList.add('truck-info');
        infoBtn.innerText = 'Info';

        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('truck-delete');
        deleteBtn.innerText = 'Delete';

        const assignBtn = document.createElement('button');
        assignBtn.classList.add('truck-assign');
        assignBtn.innerText = 'Assign';

        divBtns.append(infoBtn, deleteBtn, assignBtn);
        truckContainer.appendChild(divBtns);
        return truckContainer;
    }
}

document.addEventListener('DOMContentLoaded', getTrucks);