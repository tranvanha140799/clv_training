import { Expose } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'mdm_vsl_cntr' })
export class Vessel {
  @PrimaryColumn({ name: 'vsl_cd' })
  vslCd: string;

  @Expose()
  @Column({ name: 'vsl_clss_flg', default: 'N', nullable: true })
  vslClssFlg: string;

  @Expose()
  @Column({ name: 'vsl_eng_nm', nullable: true })
  vslEngNm: string;

  @Expose()
  @Column({ name: 'vsl_locl_nm', nullable: true })
  vslLoclNm: string;

  @Expose()
  @Column({
    name: 'foil_capa',
    type: 'numeric',
    precision: 18,
    scale: 3,
    nullable: true,
  })
  foilCapa: number;

  @Expose()
  @Column({
    name: 'doil_capa',
    type: 'numeric',
    precision: 18,
    scale: 3,
    nullable: true,
  })
  doilCapa: number;

  @Expose()
  @Column({
    name: 'frsh_wtr_capa',
    type: 'numeric',
    precision: 18,
    scale: 3,
    nullable: true,
  })
  frshWtrCapa: number;

  @Expose()
  @Column({ name: 'call_sgn_no', nullable: true })
  callSgnNo: string;

  @Expose()
  @Column({ name: 'rgst_no', nullable: true })
  rgstNo: string;

  @Expose()
  @Column({ name: 'phn_no', nullable: true })
  phnNo: string;

  @Expose()
  @Column({ name: 'fax_no', nullable: true })
  faxNo: string;

  @Expose()
  @Column({ name: 'tlx_no', nullable: true })
  tlxNo: string;

  @Expose()
  @Column({ name: 'vsl_eml', nullable: true })
  vslEml: string;

  @Expose()
  @Column({ name: 'piclb_desc', nullable: true })
  piclbDesc: string;

  @Expose()
  @Column({ name: 'rgst_port_cd', nullable: true })
  rgstPortCd: string;

  @Expose()
  @Column({ name: 'clss_no_rgst_area_nm', nullable: true })
  clssNoRgstAreaNm: string;

  @Expose()
  @Column({ name: 'vsl_clss_no', nullable: true })
  vslClssNo: string;

  @Expose()
  @Column({ name: 'vsl_bldr_nm', nullable: true })
  vslBldrNm: string;

  @Expose()
  @Column({
    name: 'loa_len',
    type: 'numeric',
    precision: 7,
    scale: 2,
    nullable: true,
  })
  loaLen: number;

  @Expose()
  @Column({
    name: 'lbp_len',
    type: 'numeric',
    precision: 7,
    scale: 2,
    nullable: true,
  })
  lbpLen: number;

  @Expose()
  @Column({
    name: 'vsl_wdt',
    type: 'numeric',
    precision: 7,
    scale: 2,
    nullable: true,
  })
  vslWdt: number;

  @Expose()
  @Column({
    name: 'vsl_dpth',
    type: 'numeric',
    precision: 6,
    scale: 3,
    nullable: true,
  })
  vslDpth: number;

  @Expose()
  @Column({
    name: 'smr_drft_hgt',
    type: 'numeric',
    precision: 8,
    scale: 3,
    nullable: true,
  })
  smrDrftHgt: number;

  @Expose()
  @Column({
    name: 'dwt_wgt',
    type: 'numeric',
    precision: 9,
    scale: 3,
    nullable: true,
  })
  dwtWgt: number;

  @Expose()
  @Column({
    name: 'lgt_shp_tong_wgt',
    type: 'numeric',
    precision: 9,
    scale: 3,
    nullable: true,
  })
  lgtShpTongWgt: number;

  @Expose()
  @Column({
    name: 'grs_rgst_tong_wgt',
    type: 'numeric',
    precision: 9,
    scale: 3,
    nullable: true,
  })
  grsRgstTongWgt: number;

  @Expose()
  @Column({
    name: 'net_rgst_tong_wgt',
    type: 'numeric',
    precision: 9,
    scale: 3,
    nullable: true,
  })
  netRgstTongWgt: number;

  @Expose()
  @Column({
    name: 'pnm_gt_wgt',
    type: 'numeric',
    precision: 9,
    scale: 3,
    nullable: true,
  })
  pnmGtWgt: number;

  @Expose()
  @Column({
    name: 'pnm_net_tong_wgt',
    type: 'numeric',
    precision: 9,
    scale: 3,
    nullable: true,
  })
  pnmNetTongWgt: number;

  @Expose()
  @Column({
    name: 'suz_gt_wgt',
    type: 'numeric',
    precision: 9,
    scale: 3,
    nullable: true,
  })
  suzGtWgt: number;

  @Expose()
  @Column({
    name: 'suz_net_tong_wgt',
    type: 'numeric',
    precision: 9,
    scale: 3,
    nullable: true,
  })
  suzNetTongWgt: number;

  @Expose()
  @Column({ name: 'mn_eng_mkr_nm', nullable: true })
  mnEngMkrNm: string;

  @Expose()
  @Column({ name: 'mn_eng_tp_desc', nullable: true })
  mnEngTpDesc: string;

  @Expose()
  @Column({
    name: 'mn_eng_bhp_pwr',
    type: 'numeric',
    precision: 6,
    nullable: true,
  })
  mnEngBhpPwr: number;

  @Expose()
  @Column({ name: 'vsl_own_ind_cd', nullable: true })
  vslOwnIndCd: string;

  @Expose()
  @Column({ name: 'vsl_rgst_cnt_cd', nullable: true })
  vslRgstCntCd: string;

  @Expose()
  @Column({ name: 'vsl_bld_cd', nullable: true })
  vslBldCd: string;

  @Expose()
  @Column({ name: 'crr_cd', nullable: true })
  crrCd: string;

  @Expose()
  @Column({ name: 'fdr_div_cd', nullable: true })
  fdrDivCd: string;

  @Expose()
  @Column({
    name: 'vsl_svc_spd',
    type: 'numeric',
    precision: 5,
    scale: 3,
    nullable: true,
  })
  vslSvcSpd: number;

  @Expose()
  @Column({
    name: 'max_spd',
    type: 'numeric',
    precision: 5,
    scale: 3,
    nullable: true,
  })
  maxSpd: number;

  @Expose()
  @Column({
    name: 'ecn_spd',
    type: 'numeric',
    precision: 5,
    scale: 3,
    nullable: true,
  })
  ecnSpd: number;

  @Expose()
  @Column({ name: 'crw_knt', type: 'numeric', precision: 5, nullable: true })
  crwKnt: number;

  @Expose()
  @Column({
    name: 'cntr_dzn_capa',
    type: 'numeric',
    precision: 18,
    scale: 3,
    nullable: true,
  })
  cntrDznCapa: number;

  @Expose()
  @Column({
    name: 'cntr_op_capa',
    type: 'numeric',
    precision: 18,
    scale: 3,
    nullable: true,
  })
  cntrOpCapa: number;

  @Expose()
  @Column({
    name: 'cntr_pnm_capa',
    type: 'numeric',
    precision: 18,
    scale: 3,
    nullable: true,
  })
  cntrPnmCapa: number;

  @Expose()
  @Column({
    name: 'cntr_vsl_clss_capa',
    type: 'numeric',
    precision: 18,
    scale: 3,
    nullable: true,
  })
  cntrVslClssCapa: number;

  @Expose()
  @Column({
    name: 'rf_rcpt_knt',
    type: 'numeric',
    precision: 5,
    nullable: true,
  })
  rfRcptKnt: number;

  @Expose()
  @Column({
    name: 'rf_rcpt_max_knt',
    type: 'numeric',
    precision: 5,
    nullable: true,
  })
  rfRcptMaxKnt: number;

  @Expose()
  @Column({
    name: 'fbd_capa',
    type: 'numeric',
    precision: 18,
    scale: 3,
    nullable: true,
  })
  fbdCapa: number;

  @Expose()
  @Column({
    name: 'dpl_capa',
    type: 'numeric',
    precision: 18,
    scale: 3,
    nullable: true,
  })
  dplCapa: number;

  @Expose()
  @Column({
    name: 'blst_tnk_capa',
    type: 'numeric',
    precision: 18,
    scale: 3,
    nullable: true,
  })
  blstTnkCapa: number;

  @Expose()
  @Column({
    name: 'foil_csm',
    type: 'numeric',
    precision: 8,
    scale: 4,
    nullable: true,
  })
  foilCsm: number;

  @Expose()
  @Column({
    name: 'doil_csm',
    type: 'numeric',
    precision: 8,
    scale: 4,
    nullable: true,
  })
  doilCsm: number;

  @Expose()
  @Column({
    name: 'frsh_wtr_csm',
    type: 'numeric',
    precision: 8,
    scale: 4,
    nullable: true,
  })
  frshWtrCsm: number;

  @Expose()
  @Column({
    name: 'mn_eng_rpm_pwr',
    type: 'numeric',
    precision: 6,
    nullable: true,
  })
  mnEngRpmPwr: number;

  @Expose()
  @Column({
    name: 'gnr_rpm_pwr',
    type: 'numeric',
    precision: 6,
    nullable: true,
  })
  gnrRpmPwr: number;

  @Expose()
  @Column({
    name: 'vsl_hgt',
    type: 'numeric',
    precision: 8,
    scale: 3,
    nullable: true,
  })
  vslHgt: number;

  @Expose()
  @Column({ name: 'rgst_dt', type: 'date', nullable: true })
  rgstDt: Date;

  @Expose()
  @Column({ name: 'vsl_edi_nm', nullable: true })
  vslEdiNm: string;

  @Expose()
  @Column({ name: 'co_cd', nullable: true })
  coCd: string;

  @Expose()
  @Column({ name: 'vsl_clz_dt', nullable: true })
  vslClzDt: string;

  @Expose()
  @Column({ name: 'vsl_cre_ofc_cd', nullable: true })
  vslCreOfcCd: string;

  @Expose()
  @Column({ name: 'vsl_delt_ofc_cd', nullable: true })
  vslDeltOfcCd: string;

  @Expose()
  @Column({ name: 'vsl_bld_area_nm', nullable: true, length: 500 })
  vslBldAreaNm: string;

  @Expose()
  @Column({ name: 'gnr_mkr_nm', nullable: true })
  gnrMkrNm: string;

  @Expose()
  @Column({ name: 'gnr_tp_desc', nullable: true })
  gnrTpDesc: string;

  @Expose()
  @Column({
    name: 'gnr_bhp_pwr',
    type: 'numeric',
    precision: 6,
    nullable: true,
  })
  gnrBhpPwr: number;

  @Expose()
  @Column({ name: 'bwthst_mkr_nm', nullable: true })
  bwthstMkrNm: string;

  @Expose()
  @Column({ name: 'bwthst_tp_desc', nullable: true })
  bwthstTpDesc: string;

  @Expose()
  @Column({
    name: 'bwthst_bhp_pwr',
    type: 'numeric',
    precision: 6,
    nullable: true,
  })
  bwthstBhpPwr: number;

  @Expose()
  @Column({
    name: 'bwthst_rpm_pwr',
    type: 'numeric',
    precision: 6,
    nullable: true,
  })
  bwthstRpmPwr: number;

  @Expose()
  @Column({ name: 'lloyd_no', nullable: true })
  lloydNo: string;

  @Expose()
  @Column({ name: 'vsl_lnch_dt', type: 'date', nullable: true })
  vslLnchDt: Date;

  @Expose()
  @Column({ name: 'vsl_de_dt', type: 'date', nullable: true })
  vslDeDt: Date;

  @Expose()
  @Column({ name: 'vsl_kel_ly_dt', type: 'date', nullable: true })
  vslKelLyDt: Date;

  @Expose()
  @Column({ name: 'vsl_hl_no', nullable: true })
  vslHlNo: string;

  @Expose()
  @Column({
    name: 'ttl_teu_knt',
    type: 'numeric',
    precision: 18,
    scale: 5,
    nullable: true,
  })
  ttlTeuKnt: number;

  @Expose()
  @Column({
    name: 'vsl_htch_knt',
    type: 'numeric',
    precision: 5,
    nullable: true,
  })
  vslHtchKnt: number;

  @Expose()
  @Column({
    name: 'vsl_hld_knt',
    type: 'numeric',
    precision: 5,
    nullable: true,
  })
  vslHldKnt: number;

  @Expose()
  @Column({ name: 'vsl_rmk', nullable: true, length: 1000 })
  vslRmk: string;

  @Expose()
  @Column({ name: 'intl_tong_certi_flg', nullable: true })
  intlTongCertiFlg: string;

  @Expose()
  @Column({
    name: 'madn_voy_suz_net_tong_wgt',
    type: 'numeric',
    precision: 9,
    scale: 3,
    nullable: true,
  })
  madnVoySuzNetTongWgt: number;

  @Expose()
  @Column({ name: 'vsl_sft_cstru_certi_exp_dt', type: 'date', nullable: true })
  vslSftCstruCertiExpDt: Date;

  @Expose()
  @Column({ name: 'vsl_sft_rdo_certi_exp_dt', type: 'date', nullable: true })
  vslSftRdoCertiExpDt: Date;

  @Expose()
  @Column({ name: 'vsl_sft_eq_certi_exp_dt', type: 'date', nullable: true })
  vslSftEqCertiExpDt: Date;

  @Expose()
  @Column({ name: 'vsl_lod_line_certi_exp_dt', type: 'date', nullable: true })
  vslLodLineCertiExpDt: Date;

  @Expose()
  @Column({ name: 'vsl_derat_certi_exp_dt', type: 'date', nullable: true })
  vslDeratCertiExpDt: Date;

  @Expose()
  @Column({ name: 'cre_usr_id', length: 100, nullable: false })
  creUsrId: string;

  @CreateDateColumn({ name: 'cre_dt' })
  creDt: Date;

  @Expose()
  @Column({ name: 'upd_usr_id', length: 100, nullable: false })
  updUsrId: string;

  @UpdateDateColumn({ name: 'upd_dt' })
  updDt: Date;

  @Expose()
  @Column({ name: 'delt_flg', default: 'N' })
  deltFlg: string;

  @Expose()
  @Column({ name: 'eai_evnt_dt', type: 'date', nullable: true })
  eaiEvntDt: Date;

  @Expose()
  @Column({ name: 'eai_if_id', length: 32, nullable: true })
  eaiIfId: string;

  @Expose()
  @Column({ name: 'modi_vsl_cd', length: 30, nullable: true })
  modiVslCd: string;

  @Expose()
  @Column({ name: 'edw_upd_dt', type: 'date', nullable: true })
  edwUpdDt: Date;

  @Expose()
  @Column({ name: 'modi_vsl_opr_tp_cd', length: 30, nullable: true })
  modiVslOprTpCd: string;

  @Expose()
  @Column({ name: 'modi_ownr_nm', length: 50, nullable: true })
  modiOwnrNm: string;

  @Expose()
  @Column({ name: 'modi_alln_vsl_cd', length: 6, nullable: true })
  modiAllnVslCd: string;

  @Expose()
  @Column({ name: 'nyk_lgcy_vsl_cd_ctnt', length: 10, nullable: true })
  nykLgcyVslCdCtnt: string;

  @Expose()
  @Column({ name: 'mol_lgcy_vsl_cd_ctnt', length: 10, nullable: true })
  molLgcyVslCdCtnt: string;

  @Expose()
  @Column({ name: 'kline_lgcy_vsl_cd_ctnt', length: 10, nullable: true })
  klineLgcyVslCdCtnt: string;

  @Expose()
  @Column({ name: 'lgcy_co_cd', length: 1, nullable: true })
  lgcyCoCd: string;
}
