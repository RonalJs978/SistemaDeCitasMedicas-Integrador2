import { useEffect, useState } from 'react';
import { User, UserPen, Shield, Mail, Calendar } from 'lucide-react';

import {
  getPatientProfile,
  updatePatientProfile,
  uploadPatientAvatar,
} from './patient-service';

const Config = () => {
  const [profile, setProfile] = useState<any>({
    dni: '',
    fecha_nac: '',
    direccion: '',
    alergias: '',
    foto_url: '',
    email: '',
    full_name: '',
  });

  const [loading, setLoading] = useState(false);

  /* =====================================
      CARGAR PERFIL
  ===================================== */
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);

      const data = await getPatientProfile();

      setProfile(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /* =====================================
      SUBIR FOTO
  ===================================== */
  const handleUploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];

      if (!file) return;

      const imageUrl = await uploadPatientAvatar(file);

      setProfile({
        ...profile,
        foto_url: imageUrl,
      });
    } catch (error) {
      console.error(error);
      alert('Error al subir imagen');
    }
  };

  /* =====================================
      GUARDAR
  ===================================== */
  const handleSave = async () => {
    try {
      setLoading(true);

      await updatePatientProfile(profile);

      alert('Perfil actualizado correctamente');
    } catch (error) {
      console.error(error);

      alert('Error al actualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        *{
          margin:0;
          padding:0;
          box-sizing:border-box;
          font-family:Arial, Helvetica, sans-serif;
        }

        .container{
          padding:10px;
          min-height:100vh;
        }

        .title{
          color:#17458f;
          font-size:40px;
          margin-bottom:30px;
          font-weight:bold;
        }

        .content{
          display:flex;
          gap:25px;
        }

        .left-section{
          width:40%;
          display:flex;
          flex-direction:column;
          gap:20px;
        }

        .right-section{
          width:60%;
          display:flex;
          flex-direction:column;
          gap:20px;
        }

        .card{
          background:white;
          border-radius:18px;
          padding:25px;
          box-shadow:0 2px 10px rgba(0,0,0,0.05);
        }

        .profile-header{
          display:flex;
          align-items:center;
          gap:20px;
          margin-bottom:30px;
        }

        .avatar-container{
          position:relative;
        }

        .avatar{
          width:100px;
          height:100px;
          border-radius:50%;
          background:#e9eef8;
          display:flex;
          align-items:center;
          justify-content:center;
          overflow:hidden;
          border:4px solid #f3f5f9;
        }

          .avatar-image{
            width:100%;
            height:100%;
            object-fit:cover;
          }

          .default-user-icon{
            font-size:42px;
            color:#17458f;
          }

        .edit-btn{
          position:absolute;
          bottom:0;
          right:0;
          width:34px;
          height:34px;
          border:none;
          border-radius:50%;
          background:#17458f;
          color:white;
          cursor:pointer;
          display:flex;
          align-items:center;
          justify-content:center;
        }

        .upload-input{
          margin-top:12px;
          width:100%;
        }

        .profile-name{
          font-size:28px;
          font-weight:bold;
          margin-bottom:5px;
        }

        .profile-email{
          color:gray;
        }

        .form-group{
          margin-bottom:18px;
        }

        .form-group label{
          display:block;
          margin-bottom:8px;
          font-size:12px;
          font-weight:bold;
          color:#666;
          letter-spacing:1px;
        }

        .form-group input{
          width:100%;
          padding:15px;
          border:none;
          border-radius:10px;
          background:#f3f5f9;
          font-size:15px;
          outline:none;
        }

        .change-password{
          display:inline-block;
          margin-top:10px;
          color:#17458f;
          font-weight:bold;
          text-decoration:none;
        }

        .security-card{
          background:#eef3fb;
          border-radius:18px;
          padding:20px;
          display:flex;
          gap:15px;
          align-items:flex-start;
        }

        .security-icon{
          color:#17458f;
          font-size:24px;
        }

        .security-title{
          color:#17458f;
          margin-bottom:10px;
        }

        .security-text{
          color:#555;
          line-height:1.5;
        }

        .top-cards{
          display:flex;
          gap:20px;
        }

        .small-card{
          flex:1;
          background:white;
          border-radius:18px;
          padding:20px;
          box-shadow:0 2px 10px rgba(0,0,0,0.05);
        }

        .card-top{
          display:flex;
          justify-content:space-between;
          align-items:center;
          margin-bottom:25px;
        }

        .icon{
          width:45px;
          height:45px;
          border-radius:12px;
          display:flex;
          align-items:center;
          justify-content:center;
          font-size:20px;
        }

        .purple{
          background:#f1e8ff;
          color:#7c4dff;
        }

        .blue{
          background:#e7f0ff;
          color:#17458f;
        }

        .small-card h3{
          margin-bottom:10px;
        }

        .small-card p{
          color:#666;
          line-height:1.5;
          font-size:14px;
        }

        .preferences-card{
          background:white;
          border-radius:18px;
          padding:30px;
          box-shadow:0 2px 10px rgba(0,0,0,0.05);
        }

        .preferences-title{
          margin-bottom:30px;
          font-size:28px;
          font-weight:bold;
        }

        .preference-item{
          display:flex;
          justify-content:space-between;
          align-items:center;
          margin-bottom:30px;
        }

        .preference-item h4{
          margin-bottom:6px;
        }

        .preference-item p{
          color:#666;
          font-size:14px;
        }

        .time-btn{
          border:none;
          background:#f1f3f7;
          padding:12px 18px;
          border-radius:10px;
          font-weight:bold;
        }

        .actions{
          display:flex;
          justify-content:flex-end;
          gap:15px;
          margin-top:20px;
        }

        .cancel-btn{
          border:none;
          background:transparent;
          color:#17458f;
          font-weight:bold;
          cursor:pointer;
        }

        .save-btn{
          border:none;
          background:#17458f;
          color:white;
          padding:15px 25px;
          border-radius:10px;
          font-weight:bold;
          cursor:pointer;
        }

        .save-btn:hover{
          opacity:0.9;
        }

        .switch{
          position:relative;
          display:inline-block;
          width:50px;
          height:26px;
        }

        .switch input{
          opacity:0;
          width:0;
          height:0;
        }

        .slider{
          position:absolute;
          inset:0;
          background:#d8d8d8;
          border-radius:20px;
          transition:0.3s;
        }

        .slider::before{
          content:"";
          position:absolute;
          width:20px;
          height:20px;
          left:3px;
          top:3px;
          background:white;
          border-radius:50%;
          transition:0.3s;
        }

        .switch input:checked + .slider{
          background:#17458f;
        }

        .switch input:checked + .slider::before{
          transform:translateX(24px);
        }

        @media(max-width:1000px){
          .content{
            flex-direction:column;
          }

          .left-section,
          .right-section{
            width:100%;
          }

          .top-cards{
            flex-direction:column;
          }
        }
      `}</style>

      <div className="container">
        <h1 className="title">Notificaciones y Ajustes</h1>

        <div className="content">
          {/* LEFT */}
          <div className="left-section">
            <div className="card">
              <div className="profile-header">
                <div className="avatar-container">
                  <div className="avatar">
                    {profile.foto_url ? (
                      <img
                        src={profile.foto_url}
                        alt="avatar"
                        className="avatar-image"
                      />
                    ) : (
                      <User className="default-user-icon" />
                    )}
                  </div>

                  <button className="edit-btn">
                    <UserPen />
                  </button>
                </div>

                <div>
                  <h2 className="profile-name">
                    {profile.full_name || 'Paciente'}
                  </h2>

                  <p className="profile-email">{profile.email}</p>
                </div>
              </div>

              {/* FOTO */}
              <div className="form-group">
                <label>FOTO DE PERFIL</label>

                <input
                  type="file"
                  accept="image/*"
                  className="upload-input"
                  onChange={handleUploadAvatar}
                />
              </div>

              {/* NOMBRE */}
              <div className="form-group">
                <label>NOMBRE COMPLETO</label>

                <input
                  type="text"
                  value={profile.full_name || ''}
                  placeholder="Falta completar"
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      full_name: e.target.value,
                    })
                  }
                />
              </div>

              {/* EMAIL */}
              <div className="form-group">
                <label>CORREO ELECTRÓNICO</label>

                <input type="email" value={profile.email || ''} disabled />
              </div>

              {/* DNI */}
              <div className="form-group">
                <label>DNI</label>

                <input
                  type="text"
                  value={profile.dni || ''}
                  placeholder="Falta completar"
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      dni: e.target.value,
                    })
                  }
                />
              </div>

              {/* FECHA */}
              <div className="form-group">
                <label>FECHA DE NACIMIENTO</label>

                <input
                  type="date"
                  value={profile.fecha_nac || ''}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      fecha_nac: e.target.value,
                    })
                  }
                />
              </div>

              {/* DIRECCION */}
              <div className="form-group">
                <label>DIRECCIÓN</label>

                <input
                  type="text"
                  value={profile.direccion || ''}
                  placeholder="Falta completar"
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      direccion: e.target.value,
                    })
                  }
                />
              </div>

              {/* ALERGIAS */}
              <div className="form-group">
                <label>ALERGIAS</label>

                <input
                  type="text"
                  value={profile.alergias || ''}
                  placeholder="Falta completar"
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      alergias: e.target.value,
                    })
                  }
                />
              </div>

              <a href="#" className="change-password">
                Cambiar contraseña
              </a>
            </div>

            {/* SECURITY */}
            <div className="security-card">
              <div className="security-icon">
                <Shield />
              </div>

              <div>
                <h3 className="security-title">Tus datos están protegidos</h3>

                <p className="security-text">
                  AuraHealth utiliza cifrado de grado médico para asegurar que
                  tu información personal y clínica permanezca confidencial bajo
                  normativas HIPAA y GDPR.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="right-section">
            <div className="top-cards">
              <div className="small-card">
                <div className="card-top">
                  <div className="icon purple">
                    <Calendar />
                  </div>

                  <label className="switch">
                    <input type="checkbox" defaultChecked />

                    <span className="slider"></span>
                  </label>
                </div>

                <h3>Añadir al Calendario</h3>

                <p>
                  Guardar las citas detalladamente y guardarlas en tu calendario
                  preferido.
                </p>
              </div>

              <div className="small-card">
                <div className="card-top">
                  <div className="icon blue">
                    <Mail />
                  </div>

                  <label className="switch">
                    <input type="checkbox" defaultChecked />

                    <span className="slider"></span>
                  </label>
                </div>

                <h3>Email</h3>

                <p>Resúmenes detallados, recetas y resultados médicos.</p>
              </div>
            </div>

            {/* PREFERENCES */}
            <div className="preferences-card">
              <h2 className="preferences-title">Preferencias de Frecuencia</h2>

              <div className="preference-item">
                <div>
                  <h4>Recordatorios de Cita</h4>

                  <p>¿Con cuánta antelación deseas ser avisado?</p>
                </div>

                <button className="time-btn">24 horas antes</button>
              </div>

              <div className="preference-item">
                <div>
                  <h4>Vencimiento de Recetas</h4>

                  <p>Alertas cuando tus medicamentos necesiten renovación.</p>
                </div>

                <label className="switch">
                  <input type="checkbox" defaultChecked />

                  <span className="slider"></span>
                </label>
              </div>

              <div className="preference-item">
                <div>
                  <h4>Contenido de Bienestar</h4>

                  <p>Tips de salud y boletines mensuales.</p>
                </div>

                <label className="switch">
                  <input type="checkbox" />

                  <span className="slider"></span>
                </label>
              </div>
            </div>
            {/* BOTONES */}
            <div className="actions">
              <button className="cancel-btn">Cancelar</button>

              <button className="save-btn" onClick={handleSave}>
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Config;
